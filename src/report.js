export function renderSummary(signals) {
  return [
    `${signals.repository.fullName}`,
    `Stars: ${signals.adoption.stars}`,
    `Forks: ${signals.adoption.forks}`,
    `Contributors: ${signals.adoption.contributors}`,
    `Open PRs: ${signals.maintenance.openPulls}`,
  ].join(" | ");
}

export function renderMarkdown(signals) {
  const repo = signals.repository;
  const adoption = signals.adoption;
  const maintenance = signals.maintenance;
  const files = signals.communityFiles;

  return `# OSS Signal Report: ${repo.fullName}

Generated: ${signals.generatedAt}

${repo.description || "No repository description provided."}

## Repository

| Signal | Value |
| --- | --- |
| URL | ${repo.htmlUrl} |
| Primary language | ${repo.language} |
| License | ${repo.license} |
| Default branch | ${repo.defaultBranch} |
| Visibility | ${repo.visibility} |
| Archived | ${repo.archived ? "Yes" : "No"} |

## Adoption Signals

| Signal | Value |
| --- | ---: |
| Stars | ${adoption.stars} |
| Forks | ${adoption.forks} |
| Watchers | ${adoption.watchers} |
| Contributors | ${adoption.contributors} |
| Open issues | ${adoption.openIssues} |

## Maintenance Signals

| Signal | Value |
| --- | --- |
| Last push | ${maintenance.pushedAt || "Unknown"} |
| Last metadata update | ${maintenance.updatedAt || "Unknown"} |
| Latest release | ${formatRelease(maintenance.latestRelease)} |
| Open pull requests | ${maintenance.openPulls} |
| Closed pull requests | ${maintenance.closedPulls} |
| GitHub community health | ${formatNullablePercent(maintenance.communityHealthPercentage)} |

## Community Files

| File | Present |
| --- | --- |
| README | ${yesNo(files.readme)} |
| License | ${yesNo(files.license)} |
| Code of conduct | ${yesNo(files.codeOfConduct)} |
| Contributing guide | ${yesNo(files.contributing)} |
| Issue template | ${yesNo(files.issueTemplate)} |
| Pull request template | ${yesNo(files.pullRequestTemplate)} |
| Security policy | ${yesNo(files.securityPolicy)} |

## Application Drafts

### Why this repository qualifies

${signals.applicationDrafts.qualification}

### How API credits would be used

${signals.applicationDrafts.apiCreditsUse}

## Safety Notes

oss-signal-kit only reads public GitHub API data. It does not create issues, open pull requests, modify repositories, star projects, upload source code, or send data to AI providers.
`;
}

function formatRelease(release) {
  if (!release) {
    return "No GitHub release detected";
  }
  return `${release.tag}${release.publishedAt ? ` (${release.publishedAt})` : ""}`;
}

function formatNullablePercent(value) {
  return value === null || value === undefined ? "Unknown" : `${value}%`;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}
