export class GitHubClient {
  constructor({ token = "", userAgent = "oss-signal-kit" } = {}) {
    this.token = token;
    this.userAgent = userAgent;
    this.baseUrl = "https://api.github.com";
  }

  async getJson(path) {
    const response = await this.request(path);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`GitHub API request failed (${response.status}) for ${path}`);
    }
    return response.json();
  }

  async getCount(path) {
    const response = await this.request(`${path}${path.includes("?") ? "&" : "?"}per_page=1`);
    if (response.status === 404) {
      return 0;
    }
    if (!response.ok) {
      throw new Error(`GitHub API request failed (${response.status}) for ${path}`);
    }

    const link = response.headers.get("link") || "";
    const lastPage = parseLastPage(link);
    if (lastPage) {
      return lastPage;
    }

    const items = await response.json();
    return Array.isArray(items) ? items.length : 0;
  }

  async request(path) {
    const headers = {
      accept: "application/vnd.github+json",
      "user-agent": this.userAgent,
      "x-github-api-version": "2022-11-28",
    };
    if (this.token) {
      headers.authorization = `Bearer ${this.token}`;
    }

    try {
      return await fetch(`${this.baseUrl}${path}`, { headers });
    } catch (error) {
      if (error.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        throw new Error(
          `Could not verify GitHub's TLS certificate for ${path}. Configure Node.js with your system or corporate CA certificate instead of disabling TLS verification.`
        );
      }
      throw new Error(`Could not reach GitHub API for ${path}: ${error.message}`);
    }
  }
}

export function parseLastPage(linkHeader) {
  const match = linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number.parseInt(match[1], 10) : 0;
}
