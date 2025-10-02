/**
 * Dynamic Components Remote Content Generator
 * 
 * Generates remote content configurations for all components from the latest GitHub release
 * This creates a foundation for automatically syncing component documentation with live release data
 */

import { createContentWithSource, createStandardTransform } from '../utils.js';
import { COMPONENT_CONFIGS, generateRepoUrls } from '../component-configs.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Fetch the latest release data from GitHub API synchronously
 * @returns {Object} Latest release data
 */
function fetchLatestReleaseSync() {
  try {
    console.log('Fetching latest release data from GitHub API...');
    // Use curl to fetch data synchronously
    const curlCommand = 'curl -s "https://api.github.com/repos/llm-d/llm-d/releases/latest"';
    const response = execSync(curlCommand, { encoding: 'utf8', timeout: 10000 });
    const releaseData = JSON.parse(response);
    
    if (releaseData.message && releaseData.message.includes('API rate limit')) {
      throw new Error('GitHub API rate limit exceeded');
    }
    
    console.log(`Successfully fetched release data: ${releaseData.tag_name}`);
    return releaseData;
  } catch (error) {
    console.warn('Failed to fetch latest release from GitHub API:', error.message);
    
    // Fallback to local release-info.json
    try {
      const releaseInfoPath = path.resolve('./release-info.json');
      const releaseInfoContent = fs.readFileSync(releaseInfoPath, 'utf8');
      const localData = JSON.parse(releaseInfoContent).current;
      console.log('Using fallback release data from release-info.json');
      
      return {
        tag_name: localData.version,
        name: localData.releaseName,
        published_at: localData.releaseDate,
        html_url: localData.releaseUrl,
        body: '' // No release notes available in fallback
      };
    } catch (fallbackError) {
      console.error('Failed to load fallback release data:', fallbackError);
      throw new Error('Could not load release data from GitHub API or local fallback');
    }
  }
}

/**
 * Parse component information from GitHub release notes
 * @param {string} releaseBody - The markdown body of the release notes
 * @returns {Array} Array of component configurations
 */
function parseComponentsFromRelease(releaseBody) {
  const components = [];
  
  if (!releaseBody) {
    console.warn('No release body provided, falling back to COMPONENT_CONFIGS');
    return COMPONENT_CONFIGS.map(config => ({
      ...config,
      version: 'latest'
    }));
  }
  
  // Look for the component summary table in the release notes
  const tableMatch = releaseBody.match(/## 🧩 Component Summary\s*\r?\n\r?\n([\s\S]*?)\r?\n\r?\n(?:NOTE:|---)/);
  
  if (tableMatch) {
    const tableContent = tableMatch[1];
    const rows = tableContent.split(/\r?\n/).filter(line => line.trim() && !line.includes('|---'));
    
    console.log(`Found ${rows.length} rows in component table`);
    
    // Skip header row, process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.split('|').map(cell => cell.trim().replace(/`/g, '')).filter(cell => cell);
      
      if (cells.length >= 4) {
        const [componentName, version, , type] = cells;
        
        // Extract repo info from component name, handle typos like "llmd" instead of "llm-d"
        let repoMatch = componentName.match(/([^/]+)\/([^/]+)/);
        if (repoMatch) {
          let [, org, name] = repoMatch;
          
          // Fix known typos in the release notes
          if (org === 'llmd') {
            org = 'llm-d';
          }
          
          // Skip deprecated components and external dependencies
          if (!version.includes('Deprecated') && 
              !version.includes('NA') && 
              !org.includes('vllm-project') && 
              !org.includes('kubernetes-sig')) {
            
            // Clean up version string
            const cleanVersion = version.replace(/^v/, '').replace(/`/g, '');
            
            // Find matching config for description
            const configMatch = COMPONENT_CONFIGS.find(config => config.name === name);
            
            components.push({
              name,
              org,
              version: cleanVersion,
              type: type.replace(/`/g, ''),
              description: configMatch?.description || `Component from ${org}/${name}`,
              category: configMatch?.category || 'Other',
              sidebarPosition: configMatch?.sidebarPosition || components.length + 1,
              branch: configMatch?.branch || 'main'
            });
            
            console.log(`Added component: ${org}/${name} v${cleanVersion}`);
          }
        }
      }
    }
  }
  
  // Add any components from COMPONENT_CONFIGS that weren't in the release
  COMPONENT_CONFIGS.forEach(config => {
    if (!components.find(comp => comp.name === config.name)) {
      console.log(`Adding missing component from COMPONENT_CONFIGS: ${config.name}`);
      components.push({
        ...config,
        version: 'latest' // No version info available
      });
    }
  });
  
  // Sort by sidebar position
  components.sort((a, b) => (a.sidebarPosition || 999) - (b.sidebarPosition || 999));
  
  console.log(`Successfully parsed ${components.length} components`);
  return components;
}

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
 * @returns {string} Markdown content for the overview page
 */
function generateComponentsOverviewContent() {
  try {
    // Fetch latest release data from GitHub
    const releaseData = fetchLatestReleaseSync();
    const components = parseComponentsFromRelease(releaseData.body || '');
    
    const currentDate = new Date().toISOString().split('T')[0];
    const releaseDate = new Date(releaseData.published_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log(`Generating overview with ${components.length} components from GitHub release ${releaseData.tag_name}`);

    let content = `---
title: llm-d Components
description: Overview of all llm-d ecosystem components and their documentation
sidebar_label: Components
sidebar_position: 1
---

# llm-d components

The llm-d ecosystem consists of multiple interconnected components that work together to provide distributed inference capabilities for large language models.

## Latest Release: [${releaseData.tag_name}](${releaseData.html_url})

**Released**: ${releaseDate}

:::info Auto-Generated Content
This page is automatically updated from the latest GitHub release information. Last updated: ${currentDate}
:::

## Components

| Component | Version | Description | Repository | Documentation |
|-----------|---------|-------------|------------|---------------|`;

    // Generate table with components from release data
    components.forEach((component) => {
      const repoUrl = `https://github.com/${component.org}/${component.name}`;
      const cleanName = component.name.replace(/^llm-d-/, '');
      const cleanTitle = cleanName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      const docLink = `./${cleanName}.md`;
      const versionBadge = component.version ? `\`${component.version}\`` : '';
      
      content += `\n| **[${cleanTitle}](${repoUrl})** | ${versionBadge} | ${component.description} | [${component.org}/${component.name}](${repoUrl}) | [View Docs](${docLink}) |`;
    });

    content += `

## Getting Started

Each component has its own detailed documentation page accessible from the links above. For a comprehensive view of how these components work together, see the main [Architecture Overview](../architecture.mdx).

### Quick Links

- [Main llm-d Repository](https://github.com/llm-d/llm-d) - Core platform and orchestration
- [llm-d-incubation Organization](https://github.com/llm-d-incubation) - Experimental and supporting components
- [Latest Release](${releaseData.html_url}) - ${releaseData.name}
- [All Releases](https://github.com/llm-d/llm-d/releases) - Complete release history

## Contributing

To contribute to any of these components, visit their respective repositories and follow their contribution guidelines. Each component maintains its own development workflow and contribution process.

---

*This page is automatically updated from the latest GitHub release data and stays current with each new release.*
`;

    return content;
    
  } catch (error) {
    console.error('Failed to generate components overview from GitHub data:', error);
    
    // Fallback to static content generation
    console.warn('Falling back to static component configuration');
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    let content = `---
title: llm-d Components
description: Overview of all llm-d ecosystem components and their documentation
sidebar_label: Components
sidebar_position: 1
---

# llm-d components

The llm-d ecosystem consists of multiple interconnected components that work together to provide distributed inference capabilities for large language models.

:::warning Fallback Content
Unable to fetch latest release data from GitHub. Showing cached component information.
:::

## Components

| Component | Description | Repository | Documentation |
|-----------|-------------|------------|---------------|`;

    // Use COMPONENT_CONFIGS as fallback
    const sortedComponents = COMPONENT_CONFIGS.sort((a, b) => a.sidebarPosition - b.sidebarPosition);
    
    sortedComponents.forEach((component) => {
      const { repoUrl } = generateRepoUrls(component);
      const cleanName = component.name.replace(/^llm-d-/, '');
      const cleanTitle = cleanName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      const docLink = `./${cleanName}.md`;
      
      content += `\n| **[${cleanTitle}](${repoUrl})** | ${component.description} | [${component.org}/${component.name}](${repoUrl}) | [View Docs](${docLink}) |`;
    });

    content += `

## Getting Started

Each component has its own detailed documentation page accessible from the links above. For a comprehensive view of how these components work together, see the main [Architecture Overview](../architecture.mdx).

---

*This page uses cached component information. For the latest release data, please check the [GitHub releases page](https://github.com/llm-d/llm-d/releases).*
`;

    return content;
  }
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
      sourceBaseUrl: 'https://raw.githubusercontent.com/llm-d/llm-d/main/',
      outDir: 'docs/architecture/Components',
      documents: ['LICENSE'], // Fetch a small file to trigger modifyContent
      
      // Plugin behavior
      noRuntimeDownloads: false,
      performCleanup: true,
      
      // Generate the overview content synchronously
      modifyContent(filename, content) {
        // Always generate the overview page regardless of the downloaded content
        const overviewContent = generateComponentsOverviewContent();
        
        return {
          filename: 'index.md',
          content: overviewContent
        };
      },
    },
  ];
}

// Export the generated component sources
export default [
  generateComponentsOverviewSource(), // Overview page first
  ...COMPONENT_CONFIGS.map(generateComponentRemoteSource) // Individual components
];