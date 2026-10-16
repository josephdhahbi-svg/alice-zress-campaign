"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { execute } = require("../automation_100_tasks");

test("all actual passing checks produce evidence but not production readiness", async () => {
  const report = await execute([{ id: "a", name: "sample", required: true,
    run: async () => ({ verified: true }) }], { retries: 0 });
  assert.equal(report.totalChecks, 1);
  assert.equal(report.passed, 1);
  assert.equal(report.allRequiredPassed, true);
  assert.equal(report.productionReady, false);
  assert.deepEqual(report.results[0].evidence, { verified: true });
});
test("mandatory failure fails closed and is not reported as passed", async () => {
  const report = await execute([{ id: "fail", name: "failing check", required: true,
    run: async () => { throw new Error("broken"); } }], { retries: 0 });
  assert.equal(report.failed, 1);
  assert.equal(report.allRequiredPassed, false);
  assert.equal(report.results[0].error, "broken");
  assert.equal(report.results[0].evidence, null);
});
test("retries are bounded and recorded", async () => {
  let calls = 0;
  const report = await execute([{ id: "retry", name: "transient", required: true,
    run: async () => { if (++calls === 1) throw new Error("transient"); return { recovered: true }; }
  }], { retries: 1 });
  assert.equal(calls, 2);
  assert.equal(report.results[0].attempts, 2);
  assert.equal(report.results[0].status, "PASSED");
});
