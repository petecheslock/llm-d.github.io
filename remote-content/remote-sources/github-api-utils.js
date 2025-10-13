/**
 * GitHub API utilities for fetching release information
 * Used to dynamically update documentation with latest release data
 */

/**
 * Get GitHub API headers with authentication if token is available
 * @returns {Object} Headers object for GitHub API requests
 */
function getGitHubApiHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'llm-d-website-builder'
  };
  
  // Check for GitHub token in environment variables
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
    console.log('Using authenticated GitHub API requests');
  } else {
    console.log('Using unauthenticated GitHub API requests (rate limited)');
  }
  
  return headers;
}

/**
 * Fetch the latest release information from GitHub API
 * @param {string} owner - GitHub repository owner
 * @param {string} repo - GitHub repository name
 * @returns {Promise<Object>} Release information object
 */
async function fetchLatestRelease(owner = 'llm-d', repo = 'llm-d') {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  
  try {
    console.log(`Fetching latest release from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      headers: getGitHubApiHeaders()
    });
    
    if (!response.ok) {
      // Log rate limit information if available
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      if (rateLimitRemaining !== null) {
        console.log(`GitHub API rate limit remaining: ${rateLimitRemaining}`);
        if (rateLimitReset) {
          const resetTime = new Date(parseInt(rateLimitReset) * 1000);
          console.log(`Rate limit resets at: ${resetTime.toISOString()}`);
        }
      }
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }
    
    const releaseData = await response.json();
    
    // Transform GitHub API response to our expected format
    const releaseDate = new Date(releaseData.published_at);
    const formattedDate = releaseDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      version: releaseData.tag_name,
      releaseDate: releaseDate.toISOString().split('T')[0],
      releaseDateFormatted: formattedDate,
      releaseUrl: releaseData.html_url,
      releaseName: releaseData.name || `llm-d ${releaseData.tag_name}`,
      releaseBody: releaseData.body,
      publishedAt: releaseData.published_at
    };
  } catch (error) {
    console.warn(`Failed to fetch latest release from GitHub API: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch all releases from GitHub API (for previous releases section)
 * @param {string} owner - GitHub repository owner
 * @param {string} repo - GitHub repository name
 * @param {number} limit - Maximum number of releases to fetch
 * @returns {Promise<Array>} Array of release information objects
 */
async function fetchAllReleases(owner = 'llm-d', repo = 'llm-d', limit = 10) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${limit}`;
  
  try {
    console.log(`Fetching releases from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      headers: getGitHubApiHeaders()
    });
    
    if (!response.ok) {
      // Log rate limit information if available
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      if (rateLimitRemaining !== null) {
        console.log(`GitHub API rate limit remaining: ${rateLimitRemaining}`);
        if (rateLimitReset) {
          const resetTime = new Date(parseInt(rateLimitReset) * 1000);
          console.log(`Rate limit resets at: ${resetTime.toISOString()}`);
        }
      }
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }
    
    const releasesData = await response.json();
    
    return releasesData.map(release => {
      const releaseDate = new Date(release.published_at);
      const formattedDate = releaseDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        version: release.tag_name,
        releaseDate: releaseDate.toISOString().split('T')[0],
        releaseDateFormatted: formattedDate,
        releaseUrl: release.html_url,
        releaseName: release.name || `llm-d ${release.tag_name}`,
        releaseBody: release.body,
        publishedAt: release.published_at,
        isPrerelease: release.prerelease,
        isDraft: release.draft
      };
    });
  } catch (error) {
    console.warn(`Failed to fetch releases from GitHub API: ${error.message}`);
    throw error;
  }
}

/**
 * Get release information from GitHub API
 * Build will fail if GitHub API is unavailable
 * @returns {Promise<Object>} Release information object
 */
async function getReleaseInfo() {
  const latestRelease = await fetchLatestRelease();
  console.log(`Successfully fetched latest release: ${latestRelease.version}`);
  return latestRelease;
}

export {
  fetchLatestRelease,
  fetchAllReleases,
  getReleaseInfo
};
