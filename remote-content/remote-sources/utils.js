/**
 * Utilities for Remote Content Sources
 * 
 * Helper functions to maintain consistency across remote content transformations
 */

import { findRepoConfig, generateRepoUrls } from './component-configs.js';
import { getRepoTransform } from './repo-transforms.js';

/**
 * Create a standardized content transform function using centralized repo configs
 * @param {string} repoName - Repository name from COMPONENT_CONFIGS or COMMON_REPO_CONFIGS
 * @returns {Function} Content transform function
 */
export function createStandardTransform(repoName) {
  const repoConfig = findRepoConfig(repoName);
  if (!repoConfig) {
    throw new Error(`Repository configuration not found for: ${repoName}`);
  }
  
  const { org, name } = repoConfig;
  const { repoUrl, ref } = generateRepoUrls(repoConfig);
  const transform = getRepoTransform(org, name);
  
  // Use ref (version or branch) instead of just branch
  return (content, sourcePath) => transform(content, { repoUrl, branch: ref, org, name, sourcePath });
}

/**
 * Generate a source callout for remote content
 * @param {string} filename - The original filename
 * @param {string} repoUrl - The GitHub repository URL (without .git)
 * @param {string} branch - The branch/tag name (e.g., 'main', 'v0.3.0')
 * @returns {string} Formatted source callout
 */
export function createSourceCallout(filename, repoUrl, branch = 'main') {
  const fileUrl = `${repoUrl}/blob/${branch}/${filename}`;
  const issuesUrl = `${repoUrl}/issues`;
  const repoName = repoUrl.split('/').slice(-2).join('/');
  
  // Check if this is a version tag (contains 'v' followed by numbers and dots)
  // Matches: v0.3.0, llm-d-modelservice-v0.2.10, etc.
  const isVersionTag = /v\d+\.\d+/.test(branch) && !['main', 'master', 'develop'].includes(branch);
  
  if (isVersionTag) {
    // For release versions, show different message
    const releaseUrl = `${repoUrl}/releases/tag/${branch}`;
    const mainFileUrl = `${repoUrl}/blob/main/${filename}`;
    return `:::info Documentation Version
This documentation corresponds to **[llm-d ${branch}](${releaseUrl})**, the latest public release. 
For the most current development changes, see [this file on main](${mainFileUrl}).

📝 To suggest changes or report issues, please [create an issue](${issuesUrl}).

*Source: [${filename}](${fileUrl})*
:::

`;
  } else {
    // For non-release branches (like 'main'), show edit link
    const editUrl = `${repoUrl}/edit/${branch}/${filename}`;
    return `:::info Content Source
This content is automatically synced from [${filename}](${fileUrl}) in the ${repoName} repository.

📝 To suggest changes, please [edit the source file](${editUrl}) or [create an issue](${issuesUrl}).
:::

`;
  }
}

/**
 * Create a complete content transformation with frontmatter and source callout
 * @param {Object} options - Configuration options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.sidebarLabel - Sidebar label
 * @param {number} options.sidebarPosition - Sidebar position
 * @param {string} options.filename - Original filename
 * @param {string} options.newFilename - New filename
 * @param {string} options.repoUrl - GitHub repository URL
 * @param {string} options.branch - Branch name
 * @param {string} options.content - Original content
 * @param {Function} [options.contentTransform] - Optional content transformation function
 * @returns {Object} Transformed content object
 */
export function createContentWithSource({
  title,
  description,
  sidebarLabel,
  sidebarPosition,
  filename,
  newFilename,
  repoUrl,
  branch = 'main',
  content,
  contentTransform
}) {
  // Escape description for YAML frontmatter (handle quotes and special chars)
  const escapedDescription = description
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"');   // Escape double quotes
  
  const frontmatter = `---
title: ${title}
description: "${escapedDescription}"
sidebar_label: ${sidebarLabel}
sidebar_position: ${sidebarPosition}
---

`;

  const sourceCallout = createSourceCallout(filename, repoUrl, branch);
  
  // Apply any additional content transformations
  const transformedContent = contentTransform ? contentTransform(content, filename) : content;
  
  // Ensure content ends with a newline before adding the callout
  const contentWithNewline = transformedContent.endsWith('\n') ? transformedContent : transformedContent + '\n';
  
  return {
    filename: newFilename,
    content: frontmatter + contentWithNewline + sourceCallout
  };
} 