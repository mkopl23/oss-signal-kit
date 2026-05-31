import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, renderSummary } from "../src/report.js";

const signals = {
  generatedAt: "2026-05-31T00:00:00.000Z",
  repository: {
    fullName: "example/project",
    htmlUrl: "https://github.com/example/project",
    description: "Example project",
    defaultBranch: "main",
    language: "JavaScript",
    license: "MIT",
    visibility: "public",
    archived: false,
  },
  adoption: {
    stars: 10,
    forks: 2,
    watchers: 1,
    openIssues: 3,
    contributors: 4,
  },
  maintenance: {
    pushedAt: "2026-05-30T00:00:00Z",
    updatedAt: "2026-05-30T00:00:00Z",
    latestRelease: { tag: "v1.0.0", publishedAt: "2026-05-29T00:00:00Z" },
    openPulls: 1,
    closedPulls: 8,
    communityHealthPercentage: 90,
  },
  communityFiles: {
    readme: true,
    license: true,
    codeOfConduct: false,
    contributing: true,
    issueTemplate: false,
    pullRequestTemplate: true,
    securityPolicy: false,
  },
  applicationDrafts: {
    qualification: "Qualification draft",
    apiCreditsUse: "Credits draft",
  },
};

test("renderSummary includes core metrics", () => {
  assert.match(renderSummary(signals), /example\/project/);
  assert.match(renderSummary(signals), /Stars: 10/);
});

test("renderMarkdown includes safety notes and application drafts", () => {
  const markdown = renderMarkdown(signals);
  assert.match(markdown, /OSS Signal Report/);
  assert.match(markdown, /Qualification draft/);
  assert.match(markdown, /only reads public GitHub API data/);
});
