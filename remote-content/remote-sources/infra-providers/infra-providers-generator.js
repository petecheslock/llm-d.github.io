/**
 * Dynamic Infra Providers Generator
 * 
 * Automatically discovers and generates infrastructure provider pages from the llm-d repository.
 * This syncs provider-specific documentation for deploying llm-d on different infrastructure.
 * 
 * Infra provider docs are synced from the specific release version defined in components-data.yaml,
 * not from the main branch. This ensures documentation matches the released version.
 */

import { createContentWithSource } from '../utils.js';
import { findRepoConfig, RELEASE_INFO } from '../component-configs.js';
import { getRepoTransform } from '../repo-transforms.js';

// Get repository configuration for the main llm-d repo
const repoConfig = findRepoConfig('llm-d');

// Use the release version from YAML instead of the branch
const releaseVersion = RELEASE_INFO.version;
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

/**
 * Configuration for infrastructure providers
 * These are the provider-specific README.md files in docs/infra-providers/
 * with their descriptive titles and sidebar positions
 */
const INFRA_PROVIDERS = [
  {
    dirName: 'aks',
    title: 'Azure Kubernetes Service',
    description: 'Deploy llm-d on Azure Kubernetes Service',
    sidebarPosition: 1
  },
  {
    dirName: 'digitalocean',
    title: 'DigitalOcean Kubernetes Service (DOKS)',
    description: 'Deploy llm-d on DigitalOcean Kubernetes Service (DOKS)',
    sidebarPosition: 2
  }
];

/**
 * Create plugin configurations for all infra providers
 */
function createInfraProviderPlugins() {
  const plugins = [];
  
  // Add individual provider pages
  INFRA_PROVIDERS.forEach((provider) => {
    const sourceFile = `docs/infra-providers/${provider.dirName}/README.md`;
    
    plugins.push([
      'docusaurus-plugin-remote-content',
      {
        name: `infra-provider-${provider.dirName}`,
        sourceBaseUrl,
        outDir: 'docs/guide/InfraProviders',
        documents: [sourceFile],
        noRuntimeDownloads: false,
        performCleanup: true,
        
        modifyContent(filename, content) {
          if (filename === sourceFile) {
            return createContentWithSource({
              title: provider.title,
              description: provider.description,
              sidebarLabel: provider.title,
              sidebarPosition: provider.sidebarPosition,
              filename: sourceFile,
              newFilename: `${provider.dirName}.md`,
              repoUrl,
              branch: releaseVersion,
              content,
              contentTransform
            });
          }
          return undefined;
        },
      },
    ]);
  });
  
  return plugins;
}

// Export all infra provider plugins
export default createInfraProviderPlugins();

