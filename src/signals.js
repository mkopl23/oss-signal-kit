export async function collectSignals(client, repository) {
  const { owner, repo } = repository;
  const encodedOwner = encodeURIComponent(owner);
  const encodedRepo = encodeURIComponent(repo);
  const base = `/repos/${encodedOwner}/${encodedRepo}`;

  const [
    repoInfo,
    communityProfile,
    latestRelease,
    contributorsCount,
    openIssuesAndPullsCount,
    openPullsCount,
    closedPullsCount,
  ] = await Promise.all([
    client.getJson(base),
    client.getJson(`${base}/community/profile`),
    client.getJson(`${base}/releases/latest`),
    client.getCount(`${base}/contributors?anon=false`),
    client.getCount(`${base}/issues?state=open`),
    client.getCount(`${base}/pulls?state=open`),
    client.getCount(`${base}/pulls?state=closed`),
  ]);

  if (!repoInfo) {
    throw new Error(`Repository not found: ${repository.fullName}`);
  }

  const openIssuesCount = Math.max(0, openIssuesAndPullsCount - openPullsCount);
  const license = repoInfo.license?.spdx_id && repoInfo.license.spdx_id !== "NOASSERTION"
    ? repoInfo.license.spdx_id
    : "Not detected";

  const signals = {
    generatedAt: new Date().toISOString(),
    repository: {
      fullName: repoInfo.full_name,
      htmlUrl: repoInfo.html_url,
      description: repoInfo.description || "",
      defaultBranch: repoInfo.default_branch,
      language: repoInfo.language || "Unknown",
      license,
      visibility: repoInfo.visibility || (repoInfo.private ? "private" : "public"),
      archived: Boolean(repoInfo.archived),
    },
    adoption: {
      stars: repoInfo.stargazers_count || 0,
      forks: repoInfo.forks_count || 0,
      watchers: repoInfo.subscribers_count || 0,
      openIssues: openIssuesCount,
      contributors: contributorsCount,
    },
    maintenance: {
      pushedAt: repoInfo.pushed_at || "",
      updatedAt: repoInfo.updated_at || "",
      latestRelease: latestRelease ? {
        name: latestRelease.name || latestRelease.tag_name,
        tag: latestRelease.tag_name,
        publishedAt: latestRelease.published_at || "",
      } : null,
      openPulls: openPullsCount,
      closedPulls: closedPullsCount,
      communityHealthPercentage: communityProfile?.health_percentage ?? null,
    },
    communityFiles: extractCommunityFiles(communityProfile),
  };

  return {
    ...signals,
    applicationDrafts: buildApplicationDrafts(signals),
  };
}

function extractCommunityFiles(profile) {
  const files = profile?.files || {};
  return {
    readme: Boolean(files.readme),
    license: Boolean(files.license),
    codeOfConduct: Boolean(files.code_of_conduct),
    contributing: Boolean(files.contributing),
    issueTemplate: Boolean(files.issue_template),
    pullRequestTemplate: Boolean(files.pull_request_template),
    securityPolicy: Boolean(files.security),
  };
}

function buildApplicationDrafts(signals) {
  const repo = signals.repository;
  const adoption = signals.adoption;
  const maintenance = signals.maintenance;
  const releaseText = maintenance.latestRelease
    ? ` Latest release: ${maintenance.latestRelease.tag}.`
    : "";

  return {
    qualification: clamp500(
      `${repo.fullName} is an actively maintained ${repo.language} OSS project with ${adoption.stars} stars, ${adoption.forks} forks, ${adoption.contributors} contributors, and ongoing issue/PR activity.${releaseText} It helps users by providing ${repo.description || "reusable open-source software"} and has clear public maintenance signals.`
    ),
    apiCreditsUse: clamp500(
      "We would use API credits for maintainer automation: summarizing issues and pull requests, generating release notes, checking documentation drift, and assisting security review. Outputs would remain reviewable by maintainers before any repository changes are made."
    ),
  };
}

function clamp500(text) {
  return text.length <= 500 ? text : `${text.slice(0, 497).trimEnd()}...`;
}
