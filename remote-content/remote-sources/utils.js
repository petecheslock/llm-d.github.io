/**
 * Utilities for Remote Content Sources
 * 
 * Helper functions to maintain consistency across remote content transformations
 */

/**
 * Generate a source callout for remote content
 * @param {string} filename - The original filename
 * @param {string} repoUrl - The GitHub repository URL (without .git)
 * @param {string} branch - The branch name (e.g., 'dev', 'main')
 * @returns {string} Formatted source callout
 */
export function createSourceCallout(filename, repoUrl, branch = 'main') {
  const fileUrl = `${repoUrl}/blob/${branch}/${filename}`;
  const editUrl = `${repoUrl}/edit/${branch}/${filename}`;
  const issuesUrl = `${repoUrl}/issues`;
  
  return `:::info Content Source
This content is automatically synced from [${filename}](${fileUrl}) in the ${repoUrl.split('/').slice(-2).join('/')} repository.

📝 To suggest changes, please [edit the source file](${editUrl}) or [create an issue](${issuesUrl}).
:::

`;
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
  const frontmatter = `---
title: ${title}
description: ${description}
sidebar_label: ${sidebarLabel}
sidebar_position: ${sidebarPosition}
---

`;

  const sourceCallout = createSourceCallout(filename, repoUrl, branch);
  
  // Apply any additional content transformations
  const transformedContent = contentTransform ? contentTransform(content) : content;
  
  return {
    filename: newFilename,
    content: frontmatter + sourceCallout + transformedContent
  };
} 