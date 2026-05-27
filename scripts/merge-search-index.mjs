#!/usr/bin/env node
/**
 * merge-search-index.mjs
 *
 * After build-all.sh copies the /docs subsite into build/docs/, merge those
 * pages into the main site's lunr search index so one search box covers both
 * llm-d.ai and llm-d.ai/docs.
 *
 * The main Docusaurus build runs before docs are copied, so docusaurus-lunr-search
 * only indexes blog/community/landing pages. This script scans the canonical
 * /docs HTML output (build/docs/, excluding versioned and dev trees) and
 * rebuilds the combined index at the build/ root.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {Worker} from 'node:worker_threads';
import lunr from 'lunr';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(PROJECT_DIR, 'build');
const DOCS_DIR = path.join(BUILD_DIR, 'docs');
const HTML_TO_DOC = require.resolve('docusaurus-lunr-search/src/html-to-doc.js');

const SEARCH_DOC = path.join(BUILD_DIR, 'search-doc.json');
const LUNR_INDEX = path.join(BUILD_DIR, 'lunr-index.json');

const SEMVER_DIR = /^\d+\.\d+\.\d+$/;
const SKIP_DOC_DIRS = new Set(['dev', 'assets', 'img']);

function isIndexableDocsHtml(relativePath) {
  if (relativePath === '404.html') return false;
  if (relativePath.startsWith('assets/')) return false;

  const parts = relativePath.split('/');
  if (parts.some((part) => SEMVER_DIR.test(part) || SKIP_DOC_DIRS.has(part))) {
    return false;
  }

  return relativePath.endsWith('.html');
}

function htmlPathToUrl(relativePath) {
  const withoutExt = relativePath.replace(/\.html$/, '');
  if (withoutExt === 'index') return '/docs';
  if (withoutExt.endsWith('/index')) {
    return `/docs/${withoutExt.slice(0, -'/index'.length)}`;
  }
  return `/docs/${withoutExt}`;
}

function discoverDocsFiles() {
  const files = [];

  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        const topLevel = relative.split('/')[0];
        if (SEMVER_DIR.test(topLevel) || SKIP_DOC_DIRS.has(topLevel)) {
          continue;
        }
        walk(path.join(dir, entry.name), relative);
        continue;
      }

      if (!isIndexableDocsHtml(relative)) continue;

      files.push({
        path: path.join(dir, entry.name),
        url: htmlPathToUrl(relative),
      });
    }
  }

  if (fs.existsSync(DOCS_DIR)) {
    walk(DOCS_DIR);
  }

  return files;
}

function scanHtmlFiles(files) {
  if (!files.length) return Promise.resolve([]);

  const docs = [];
  let nextIndex = 0;
  let activeWorkers = 0;
  const workerCount = Math.min(Math.max(2, os.cpus().length), files.length);

  return new Promise((resolve, reject) => {
    const handleMessage = ([isDoc, payload], worker) => {
      if (isDoc) {
        docs.push(payload);
      } else if (nextIndex < files.length) {
        worker.postMessage(files[nextIndex++]);
      } else {
        worker.postMessage(null);
      }
    };

    for (let i = 0; i < workerCount; i++) {
      if (nextIndex >= files.length) break;

      const worker = new Worker(HTML_TO_DOC, {workerData: {loadedVersions: null}});
      worker.on('error', reject);
      worker.on('message', (message) => handleMessage(message, worker));
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`HTML scanner exited with code ${code}`));
          return;
        }
        activeWorkers -= 1;
        if (activeWorkers <= 0) resolve(docs);
      });

      activeWorkers += 1;
      worker.postMessage(files[nextIndex++]);
    }
  });
}

function buildLunrIndex(searchDocs, options = {}) {
  const fields = {
    title: {boost: 200, ...options.fields?.title},
    content: {boost: 2, ...options.fields?.content},
    keywords: {boost: 100, ...options.fields?.keywords},
  };

  const lunrBuilder = lunr(function configure() {
    this.ref('id');
    Object.entries(fields).forEach(([key, value]) => this.field(key, value));
    this.metadataWhitelist = ['position'];

    const {build} = this;
    this.build = () => {
      this.build = build;
      return this;
    };
  });

  searchDocs.forEach((doc, id) => {
    lunrBuilder.add({
      id,
      title: doc.title,
      content: doc.content,
      keywords: doc.keywords ?? '',
    });
  });

  return lunrBuilder.build();
}

function updateHashedCopies(searchDocContents, lunrIndexContents) {
  for (const entry of fs.readdirSync(BUILD_DIR)) {
    if (/^search-doc-\d+\.json$/.test(entry)) {
      fs.writeFileSync(path.join(BUILD_DIR, entry), searchDocContents);
    }
    if (/^lunr-index-\d+\.json$/.test(entry)) {
      fs.writeFileSync(path.join(BUILD_DIR, entry), lunrIndexContents);
    }
  }
}

async function main() {
  if (!fs.existsSync(SEARCH_DOC)) {
    console.error('merge-search-index: missing build/search-doc.json — run main site build first');
    process.exit(1);
  }

  const existing = JSON.parse(fs.readFileSync(SEARCH_DOC, 'utf8'));
  const mainDocs = existing.searchDocs ?? [];
  const options = existing.options ?? {languages: ['en']};

  const docsFiles = discoverDocsFiles();
  console.log(`merge-search-index: scanning ${docsFiles.length} /docs pages`);

  const docsEntries = await scanHtmlFiles(docsFiles);
  const mergedDocs = [...mainDocs, ...docsEntries];

  const lunrIndex = buildLunrIndex(mergedDocs, options);
  const searchDocContents = JSON.stringify({searchDocs: mergedDocs, options});
  const lunrIndexContents = JSON.stringify(lunrIndex);

  fs.writeFileSync(SEARCH_DOC, searchDocContents);
  fs.writeFileSync(LUNR_INDEX, lunrIndexContents);
  updateHashedCopies(searchDocContents, lunrIndexContents);

  const docsUrlCount = mergedDocs.filter((doc) => doc.url?.startsWith('/docs')).length;
  console.log(
    `merge-search-index: ${mergedDocs.length} total entries (${mainDocs.length} main + ${docsEntries.length} docs, ${docsUrlCount} /docs URLs)`,
  );
}

main().catch((error) => {
  console.error('merge-search-index failed:', error);
  process.exit(1);
});
