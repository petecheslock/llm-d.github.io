#!/usr/bin/env node
/**
 * Release Sync Script
 * 
 * Fetches the latest release information from GitHub and updates components-data.yaml
 * This is a one-time sync script to be run manually when updating to a new release.
 * 
 * Usage:
 *   node sync-release.mjs
 *   node sync-release.mjs --dry-run  (preview changes without writing)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_API_URL = 'https://api.github.com/repos/llm-d/llm-d/releases/latest';
const YAML_PATH = path.join(__dirname, 'components-data.yaml');

/**
 * Fetch the latest release from GitHub
 */
async function fetchLatestRelease() {
  console.log('Fetching latest release from GitHub...');
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'llm-d-website-sync'
  };
  
  // Use GitHub token if available
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
    console.log('Using authenticated GitHub API request');
  }
  
  const response = await fetch(GITHUB_API_URL, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Parse release date into formatted string
 */
function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Extract component information from release body
 * Looks for sections with ## headers containing llm-d repos
 */
function extractComponents(releaseBody) {
  const components = [];
  
  // Split by any ## headers
  const sections = releaseBody.split(/(?=^## )/m);
  
  for (const section of sections) {
    // Look for any ## header with llm-d or llm-d-incubation repos
    const headerMatch = section.match(/^## [^\n]*?(llm-d(?:-incubation)?\/([^\s\n\r]+))/m);
    if (!headerMatch) continue;
    
    const fullName = headerMatch[1].trim();
    const [org, name] = fullName.split('/');
    
    // Extract description (handles both * and - bullet formats, and both Description/description)
    const descMatch = section.match(/[-*]\s*\*\*Description\*\*:?\s*(.+?)[\r\n]/i);
    const description = descMatch ? descMatch[1].trim() : null;
    
    // Extract diff/version (handles both * and - bullet formats)
    const diffMatch = section.match(/[-*]\s*\*\*Diff\*\*:?\s*\[?([^\]\r\n]+)/i);
    const diff = diffMatch ? diffMatch[1].trim() : null;
    
    // Extract version from diff if available
    let version = null;
    if (diff) {
      const versionMatch = diff.match(/→\s*(v[\d.]+)/);
      if (versionMatch) {
        version = versionMatch[1];
      }
    }
    
    if (description) {
      components.push({
        fullName,
        org,
        name,
        description,
        version,
        diff
      });
    }
  }
  
  return components;
}

/**
 * Update components in YAML data with information from release
 */
function updateComponentsWithReleaseInfo(yamlComponents, releaseComponents) {
  const updated = [...yamlComponents];
  
  for (const releaseComp of releaseComponents) {
    const existingIndex = updated.findIndex(c => c.name === releaseComp.name);
    
    if (existingIndex >= 0) {
      // Update existing component with latest info from release
      console.log(`  ✓ Found ${releaseComp.name} - updating description`);
      updated[existingIndex] = {
        ...updated[existingIndex],
        description: releaseComp.description,
      };
      
      if (releaseComp.version) {
        console.log(`    Version: ${releaseComp.version}`);
      }
    } else {
      console.log(`  ⚠ Component ${releaseComp.name} found in release but not in YAML`);
      console.log(`    Full name: ${releaseComp.fullName}`);
      console.log(`    Description: ${releaseComp.description}`);
    }
  }
  
  return updated;
}

/**
 * Main sync function
 */
async function syncRelease(dryRun = false) {
  try {
    // Fetch latest release
    const release = await fetchLatestRelease();
    
    console.log('\n✓ Latest release fetched successfully');
    console.log(`  Version: ${release.tag_name}`);
    console.log(`  Name: ${release.name}`);
    console.log(`  Published: ${release.published_at}`);
    console.log(`  URL: ${release.html_url}`);
    
    // Parse release information
    const releaseDate = new Date(release.published_at);
    const releaseInfo = {
      version: release.tag_name,
      releaseDate: releaseDate.toISOString().split('T')[0],
      releaseDateFormatted: formatReleaseDate(release.published_at),
      releaseUrl: release.html_url,
      releaseName: release.name || `llm-d ${release.tag_name}`
    };
    
    console.log('\n✓ Release information parsed');
    
    // Extract component information
    console.log('\nExtracting component information from release notes...');
    const releaseComponents = extractComponents(release.body);
    console.log(`✓ Found ${releaseComponents.length} llm-d components in release notes`);
    
    if (releaseComponents.length > 0) {
      releaseComponents.forEach(comp => {
        console.log(`  - ${comp.fullName}${comp.version ? ` (${comp.version})` : ''}`);
      });
    } else {
      console.log('  (No components extracted - check regex patterns)');
    }
    
    // Load existing YAML
    console.log('\nLoading existing components-data.yaml...');
    const yamlContent = fs.readFileSync(YAML_PATH, 'utf8');
    const data = yaml.load(yamlContent);
    
    // Update release info
    data.release = releaseInfo;
    
    // Update component descriptions from release notes
    if (releaseComponents.length > 0) {
      console.log('\nUpdating component descriptions from release...');
      data.components = updateComponentsWithReleaseInfo(data.components, releaseComponents);
    } else {
      console.log('\nSkipping component updates (no components extracted)');
    }
    
    // Generate updated YAML with comment header
    const yamlHeader = `# llm-d Components and Release Information
# This file contains static data for generating the Components documentation page
# Update this file when there are new releases or component changes
#
# Last synced from: ${release.html_url}
# Sync date: ${new Date().toISOString()}

`;
    
    const updatedYaml = yamlHeader + yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    
    if (dryRun) {
      console.log('\n' + '='.repeat(80));
      console.log('DRY RUN - Changes that would be made:');
      console.log('='.repeat(80));
      console.log(updatedYaml);
      console.log('='.repeat(80));
      console.log('\nNo changes written (dry run mode)');
    } else {
      // Write updated YAML
      fs.writeFileSync(YAML_PATH, updatedYaml, 'utf8');
      console.log('\n✓ Updated components-data.yaml successfully!');
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('Summary:');
    console.log('='.repeat(80));
    console.log(`Release Version: ${releaseInfo.version}`);
    console.log(`Release Date: ${releaseInfo.releaseDateFormatted}`);
    console.log(`Components in Release: ${releaseComponents.length}`);
    console.log(`Components in YAML: ${data.components.length}`);
    console.log(`YAML File: ${YAML_PATH}`);
    console.log('='.repeat(80));
    
    if (!dryRun) {
      console.log('\nNext steps:');
      console.log('1. Review the changes: git diff remote-content/remote-sources/components-data.yaml');
      console.log('2. Rebuild the site: npm run build');
      console.log('3. Commit the changes: git add remote-content/remote-sources/components-data.yaml && git commit -m "Update to release ' + releaseInfo.version + '"');
    }
    
  } catch (error) {
    console.error('\n❌ Error syncing release:');
    console.error(error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');

if (dryRun) {
  console.log('Running in DRY RUN mode - no changes will be written\n');
}

// Run the sync
syncRelease(dryRun);
