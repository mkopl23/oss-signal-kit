import test from "node:test";
import assert from "node:assert/strict";
import { collectSignals } from "../src/signals.js";

test("collectSignals builds deterministic application drafts", async () => {
  const client = {
    async getJson(path) {
      if (path.endsWith("/community/profile")) {
        return {
          health_percentage: 80,
          files: {
            readme: {},
            license: {},
            contributing: {},
          },
        };
      }
      if (path.endsWith("/releases/latest")) {
        return {
          name: "v1",
          tag_name: "v1.0.0",
          published_at: "2026-05-30T00:00:00Z",
        };
      }
      return {
        full_name: "example/project",
        html_url: "https://github.com/example/project",
        description: "useful tooling",
        default_branch: "main",
        language: "JavaScript",
        visibility: "public",
        archived: false,
        stargazers_count: 123,
        forks_count: 12,
        subscribers_count: 5,
        pushed_at: "2026-05-30T00:00:00Z",
        updated_at: "2026-05-30T00:00:00Z",
        license: { spdx_id: "MIT" },
      };
    },
    async getCount(path) {
      if (path.includes("contributors")) return 7;
      if (path.includes("issues")) return 4;
      if (path.includes("pulls?state=open")) return 2;
      if (path.includes("pulls?state=closed")) return 9;
      return 0;
    },
  };

  const signals = await collectSignals(client, {
    owner: "example",
    repo: "project",
    fullName: "example/project",
  });

  assert.equal(signals.repository.fullName, "example/project");
  assert.equal(signals.adoption.stars, 123);
  assert.equal(signals.maintenance.openPulls, 2);
  assert.ok(signals.applicationDrafts.qualification.length <= 500);
  assert.ok(signals.applicationDrafts.apiCreditsUse.length <= 500);
});
