/**
 * Dynamic Components Remote Content Generator
 * 
 * Generates remote content configurations for all components in the latest release
 * This creates a foundation for automatically syncing component documentation
 * Version information is dynamically fetched from GitHub API during build
 */

import { createContentWithSource, createStandardTransform } from '../utils.js';
import { COMPONENT_CONFIGS, generateRepoUrls } from '../component-configs.js';
import { getReleaseInfo } from '../github-api-utils.js';

/**
 * Generate a remote content configuration for a single component
 * @param {Object} config - Component configuration
 * @returns {Array} Remote content plugin configuration
 */
function generateComponentRemoteSource(config) {
  const { name, org, branch, description, sidebarPosition } = config;
  const { repoUrl, sourceBaseUrl } = generateRepoUrls(config);
  
  return [
    'docusaurus-plugin-remote-content',
    {
      // Basic configuration
      name: `component-${name}`,
      sourceBaseUrl,
      outDir: 'docs/architecture/Components',
      documents: ['README.md'],
      
      // Plugin behavior
      noRuntimeDownloads: false,
      performCleanup: true,
      
      // Transform the content for this specific document
      modifyContent(filename, content) {
        if (filename === 'README.md') {
          // Generate clean names without llm-d prefix
          const cleanName = name.replace(/^llm-d-/, '');
          const cleanTitle = cleanName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          return createContentWithSource({
            title: cleanTitle,
            description,
            sidebarLabel: cleanTitle,
            sidebarPosition,
            filename: 'README.md',
            newFilename: `${cleanName}.md`,
            repoUrl,
            branch,
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
 * Generate the components overview page content
 * @returns {Promise<string>} Markdown content for the overview page
 */
async function generateComponentsOverviewContent() {
  // Fetch latest release information from GitHub API (build fails if unavailable)
  const versionInfo = await getReleaseInfo();
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Group components by category
  const categorizedComponents = COMPONENT_CONFIGS.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {});

  let content = `---
title: llm-d Components
description: Overview of all llm-d ecosystem components and their documentation
sidebar_label: Components
sidebar_position: 1
---

# llm-d components

The llm-d ecosystem consists of multiple interconnected components that work together to provide distributed inference capabilities for large language models.

## Latest Release: [${versionInfo.version}](${versionInfo.releaseUrl})

**Released**: ${versionInfo.releaseDateFormatted}

:::info Auto-Generated Content
This page is automatically updated from the latest component repository information and release data. Last updated: ${currentDate}
:::

## Components

| Component | Description | Repository | Documentation |
|-----------|-------------|------------|---------------|`;

  // Generate single table with all components (sorted by sidebarPosition)
  const sortedComponents = COMPONENT_CONFIGS.sort((a, b) => a.sidebarPosition - b.sidebarPosition);
  
  sortedComponents.forEach((component) => {
    const { repoUrl } = generateRepoUrls(component);
    const cleanName = component.name.replace(/^llm-d-/, '');
    const cleanTitle = cleanName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    const docLink = `./${cleanName}`;
    
    content += `\n| **[${cleanTitle}](${repoUrl})** | ${component.description} | [${component.org}/${component.name}](${repoUrl}) | [View Docs](${docLink}) |`;
  });

  content += `

## Getting Started

Each component has its own detailed documentation page accessible from the links above. For a comprehensive view of how these components work together, see the main [Architecture Overview](../architecture.mdx).

### Quick Links

- [Main llm-d Repository](https://github.com/llm-d/llm-d) - Core platform and orchestration
- [llm-d-incubation Organization](https://github.com/llm-d-incubation) - Experimental and supporting components
- [Latest Release](${versionInfo.releaseUrl}) - ${versionInfo.releaseName}
- [All Releases](https://github.com/llm-d/llm-d/releases) - Complete release history

## Previous Releases

For information about previous versions and their features, visit the [GitHub Releases page](https://github.com/llm-d/llm-d/releases).

:::tip Automatic Updates
This page automatically fetches the latest release information from the [GitHub API](https://api.github.com/repos/llm-d/llm-d/releases/latest) during each build, ensuring you always see the most current version information.
:::

## Contributing

To contribute to any of these components, visit their respective repositories and follow their contribution guidelines. Each component maintains its own development workflow and contribution process.

---

*This page is automatically updated from the component configurations and stays up to date with the latest release information.*
`;

  return content;
}

/**
 * Generate the components overview page remote source
 * @returns {Array} Remote content plugin configuration for overview page
 */
function generateComponentsOverviewSource() {
  return [
    'docusaurus-plugin-remote-content',
    {
      // Basic configuration  
      name: 'components-overview',
      sourceBaseUrl: 'https://raw.githubusercontent.com/llm-d/llm-d/main/', // Dummy URL
      outDir: 'docs/architecture/Components',
      documents: ['LICENSE'], // Fetch a small file to trigger modifyContent
      
      // Plugin behavior
      noRuntimeDownloads: false,
      performCleanup: true,
      
      // Generate the overview content
      async modifyContent(filename, content) {
        // Always generate the overview page regardless of the downloaded content
        const overviewContent = await generateComponentsOverviewContent();
        
        return {
          filename: 'index.md',
          content: overviewContent
        };
      },
    },
  ];
}

/**
 * Generate all component remote sources including the overview page
 * @returns {Array} Array of remote content plugin configurations
 */
function generateAllComponentSources() {
  return [
    generateComponentsOverviewSource(), // Overview page first
    ...COMPONENT_CONFIGS.map(generateComponentRemoteSource) // Individual components
  ];
}

// Export the generated component sources
export default generateAllComponentSources(); 