/**
 * Components Remote Content Generator
 * 
 * Generates remote content configurations for all components from a static YAML file.
 * Component READMEs are synced from the main branch.
 * The "Latest Release" page renders version tags from YAML to show the release component versions.
 * 
 * Component pages are output to docs/architecture/Components/ (no landing page).
 * Latest Release page is output to docs/architecture/latest-release.md.
 */

import { createContentWithSource, createStandardTransform } from '../utils.js';
import { generateRepoUrls } from '../component-configs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load components data from YAML file
const yamlPath = path.join(__dirname, '..', 'components-data.yaml');
const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const componentsData = yaml.load(yamlContent);

/**
 * Generate a remote content configuration for a single component
 * Syncs README from main branch
 * @param {Object} config - Component configuration
 * @returns {Array} Remote content plugin configuration
 */
function generateComponentRemoteSource(config) {
  const { name, description, sidebarPosition } = config;
  // generateRepoUrls now always returns 'main' for syncing
  const { repoUrl, sourceBaseUrl, ref } = generateRepoUrls(config);
  
  return [
    'docusaurus-plugin-remote-content',
    {
      // Basic configuration
      name: `component-${name}`,
      sourceBaseUrl,
      outDir: 'docs/architecture/Components',  // Output to Components/ folder
      documents: ['README.md'],
      
      // Plugin behavior
      noRuntimeDownloads: false,
      performCleanup: true,
      
      // Transform the content for this specific document
      modifyContent(filename, content) {
        if (filename === 'README.md') {
          // Generate clean names without llm-d prefix
          const cleanName = name.replace(/^llm-d-/, '');
          
          // Use custom sidebarLabel from config if provided, otherwise auto-generate
          const displayLabel = config.sidebarLabel || cleanName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          return createContentWithSource({
            title: displayLabel,
            description,
            sidebarLabel: displayLabel,
            sidebarPosition,  // Keep original position within Components category
            filename: 'README.md',
            newFilename: `${cleanName}.md`,
            repoUrl,
            branch: ref, // Always 'main' now
            content,
            // Transform content to work in docusaurus context
            contentTransform: createStandardTransform(name)
          });
        }
        return undefined;
      },
    },
  ];
}

/**
 * Generate the Latest Release page content
 * @returns {string} Markdown content for the release page
 */
function generateLatestReleaseContent() {
  const versionInfo = componentsData.release;
  
  let content = `---
title: "Latest Release: ${versionInfo.version}"
description: "llm-d ${versionInfo.version} release - component versions and documentation"
sidebar_label: Latest Release
sidebar_position: 1
---

# llm-d ${versionInfo.version}

**Released**: ${versionInfo.releaseDateFormatted}

**Full Release Notes**: [View on GitHub](${versionInfo.releaseUrl})

The llm-d ecosystem consists of multiple interconnected components that work together to provide distributed inference capabilities for large language models.

## Components

| Component | Description | Repository | Version | Documentation |
|-----------|-------------|------------|---------|---------------|`;

  // Generate single table with all components (sorted by sidebarPosition)
  const sortedComponents = [...componentsData.components].sort((a, b) => a.sidebarPosition - b.sidebarPosition);
  
  sortedComponents.forEach((component) => {
    const { repoUrl } = generateRepoUrls(component);
    const cleanName = component.name.replace(/^llm-d-/, '');
    
    // Use custom sidebarLabel if provided, otherwise auto-generate
    const displayLabel = component.sidebarLabel || cleanName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    const docLink = `./Components/${cleanName}`;  // Link to Components/ folder
    
    // Create version link to GitHub releases
    const versionTag = component.version || 'latest';
    const versionUrl = `${repoUrl}/releases/tag/${versionTag}`;
    const versionLink = `[${versionTag}](${versionUrl})`;
    
    content += `\n| **[${displayLabel}](${repoUrl})** | ${component.description} | [${component.org}/${component.name}](${repoUrl}) | ${versionLink} | [View Docs](${docLink}) |`;
  });

  content += `

## Getting Started

Each component has its own detailed documentation page accessible from the sidebar. For a comprehensive view of how these components work together, see the main [Architecture Overview](./architecture.mdx).

### Quick Links

- [Main llm-d Repository](https://github.com/llm-d/llm-d) - Core platform and orchestration
- [llm-d-incubation Organization](https://github.com/llm-d-incubation) - Experimental and supporting components
- [Full Release Notes](${versionInfo.releaseUrl}) - ${versionInfo.releaseName}
- [All Releases](https://github.com/llm-d/llm-d/releases) - Complete release history

## Previous Releases

For information about previous versions and their features, visit the [GitHub Releases page](https://github.com/llm-d/llm-d/releases).

## Contributing

To contribute to any of these components, visit their respective repositories and follow their contribution guidelines. Each component maintains its own development workflow and contribution process.
`;

  return content;
}

/**
 * Generate the Latest Release page remote source
 * @returns {Array} Remote content plugin configuration for the release page
 */
function generateLatestReleaseSource() {
  return [
    'docusaurus-plugin-remote-content',
    {
      // Basic configuration  
      name: 'latest-release',
      sourceBaseUrl: 'https://raw.githubusercontent.com/llm-d/llm-d/main/', // Dummy URL
      outDir: 'docs/architecture',  // Output to architecture/ directly
      documents: ['LICENSE'], // Fetch a small file to trigger modifyContent
      
      // Plugin behavior
      noRuntimeDownloads: false,
      performCleanup: true,
      
      // Generate the release page content
      modifyContent(filename, content) {
        // Always generate the release page regardless of the downloaded content
        const releaseContent = generateLatestReleaseContent();
        
        return {
          filename: 'latest-release.md',
          content: releaseContent
        };
      },
    },
  ];
}

/**
 * Generate all component remote sources including the Latest Release page
 * @returns {Array} Array of remote content plugin configurations
 */
function generateAllComponentSources() {
  return [
    generateLatestReleaseSource(), // Latest Release page
    ...componentsData.components.map(generateComponentRemoteSource) // Individual component pages
  ];
}

// Export the generated component sources
export default generateAllComponentSources();
