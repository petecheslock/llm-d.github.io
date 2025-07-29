/**
 * Guide Prerequisites Remote Content
 * 
 * Downloads the quickstart README.md file from the llm-d-infra repository
 * and transforms it into docs/guide/Installation/prerequisites.md
 */

import { createContentWithSource } from './utils.js';

export default [
  'docusaurus-plugin-remote-content',
  {
    // Basic configuration
    name: 'guide-prerequisites',
    sourceBaseUrl: 'https://raw.githubusercontent.com/llm-d-incubation/llm-d-infra/main/',
    outDir: 'docs/guide/Installation',
    documents: ['quickstart/README.md'],
    
    // Plugin behavior
    noRuntimeDownloads: false,  // Download automatically when building
    performCleanup: true,       // Clean up files after build
    
    // Transform the content for this specific document
    modifyContent(filename, content) {
      if (filename === 'quickstart/README.md') {
        return createContentWithSource({
          title: 'Prerequisites',
          description: 'Prerequisites for running the llm-d QuickStart',
          sidebarLabel: 'Prerequisites',
          sidebarPosition: 1,
          filename: 'quickstart/README.md',
          newFilename: 'prerequisites.md',
          repoUrl: 'https://github.com/llm-d-incubation/llm-d-infra',
          branch: 'main',
          content,
          // Transform content to work in docusaurus context
          contentTransform: (content) => content
            // Fix any relative links that might break
            .replace(/\]\(examples\//g, '](../')
            .replace(/\]\(\.\//g, '](')
            // Fix MDX compilation issues with angle bracket URLs
            .replace(/<(http[s]?:\/\/[^>]+)>/g, '`$1`')
            // Convert relative markdown links to repository links
            .replace(/\]\(([^)]+\.md)\)/g, '](https://github.com/llm-d-incubation/llm-d-infra/blob/main/quickstart/$1)')
            // Fix file links to point to repository
            .replace(/\]\(([^)]+\.(yaml|json|sh))\)/g, '](https://github.com/llm-d-incubation/llm-d-infra/blob/main/quickstart/$1)')
            // Fix broken anchor reference
            .replace(/#openshift-and-grafana/g, '#install-on-openshift')
            // Fix relative path references to files
            .replace(/\]\(grafana\/dashboards\/([^)]+)\)/g, '](https://github.com/llm-d-incubation/llm-d-infra/blob/main/quickstart/grafana/dashboards/$1)')
        });
      }
      return undefined;
    },
  },
]; 