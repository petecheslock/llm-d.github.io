/**
 * Main Architecture README Remote Content
 * 
 * Downloads the README.md file from the main llm-d repository
 * and transforms it into docs/architecture/architecture.mdx
 * 
 * Syncs from the specific release version defined in components-data.yaml,
 * not from the main branch. This ensures documentation matches the released version.
 */

import { createContentWithSource } from '../utils.js';
import { findRepoConfig, RELEASE_INFO } from '../component-configs.js';
import { getRepoTransform } from '../repo-transforms.js';

// Get repository configuration from centralized config
const repoConfig = findRepoConfig('llm-d');
const releaseVersion = RELEASE_INFO.version;

// Build URLs using the release version instead of main branch
const repoUrl = `https://github.com/${repoConfig.org}/${repoConfig.name}`;
const sourceBaseUrl = `https://raw.githubusercontent.com/${repoConfig.org}/${repoConfig.name}/${releaseVersion}/`;

// Create a custom transform that uses the release version instead of 'main'
const transform = getRepoTransform(repoConfig.org, repoConfig.name);
const contentTransform = (content, sourcePath) => transform(content, { 
  repoUrl, 
  branch: releaseVersion,  // Use release version, not 'main'
  org: repoConfig.org, 
  name: repoConfig.name, 
  sourcePath 
});

export default [
  'docusaurus-plugin-remote-content',
  {
    // Basic configuration - URLs use release version
    name: 'architecture-main',
    sourceBaseUrl,
    outDir: 'docs/architecture',
    documents: ['README.md'],
    
    // Plugin behavior
    noRuntimeDownloads: false,
    performCleanup: true,
    
    // Transform the content for this specific document
    modifyContent(filename, content) {
      if (filename === 'README.md') {
        return createContentWithSource({
          title: 'llm-d Architecture',
          description: 'Overview of llm-d distributed inference architecture and components',
          sidebarLabel: 'llm-d Architecture',
          sidebarPosition: 0,
          filename: 'README.md',
          newFilename: 'architecture.mdx',
          repoUrl,
          branch: releaseVersion,  // Use release version for footer
          content,
          contentTransform
          // Note: Not passing mainReleaseVersion here since this IS the main llm-d repo
          // This will use Scenario 2 footer format: "llm-d v0.3.0, the latest public release"
        });
      }
      return undefined;
    },
  },
]; 