/**
 * Quickstart Guide Remote Content
 * 
 * Downloads the quickstart/README.md file from the llm-d-deployer repository
 * and transforms it into docs/guide/Installation/quickstart.md
 */

import { createContentWithSource } from './utils.js';

export default [
  'docusaurus-plugin-remote-content',
  {
    // Basic configuration
    name: 'quickstart-guide',
    sourceBaseUrl: 'https://raw.githubusercontent.com/llm-d/llm-d-deployer/main/',
    outDir: 'docs/guide/Installation',
    documents: ['quickstart/README.md'],
    
    // Plugin behavior
    noRuntimeDownloads: false,  // Download automatically when building
    performCleanup: true,       // Clean up files after build
    
    // Transform the content for this specific document
    modifyContent(filename, content) {
      if (filename === 'quickstart/README.md') {
        return createContentWithSource({
          title: 'Quick Start installer',
          description: 'Getting Started with llm-d on Kubernetes using the Quick Start installer',
          sidebarLabel: 'Quick Start installer',
          sidebarPosition: 2,
          filename: 'quickstart/README.md',
          newFilename: 'quickstart.md',
          repoUrl: 'https://github.com/llm-d/llm-d-deployer',
          branch: 'main',
          content,
          // Fix any content transformations if needed
          contentTransform: (content) => {
            // Remove any duplicate headers or adjust content as needed
            return content
              .replace(/^#\s+/gm, '## ') // Convert all h1 to h2 since we have a title in frontmatter
              .replace(/^##\s+##\s+/gm, '## ') // Fix any double h2s
              // Fix HTML anchor tags that are incompatible with MDX
              .replace(/<a name="[^"]*"[^>]*><\/a>/g, '') // Remove HTML anchor tags
              // Fix any other HTML elements that might cause issues
              .replace(/<([^>]+)>/g, (match, tag) => {
                // Convert simple HTML tags to markdown where possible
                if (tag.startsWith('br')) return '<br/>';
                // Remove other problematic HTML tags
                return '';
              });
          }
        });
      }
      return undefined;
    },
  },
]; 