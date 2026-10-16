"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateTaskReport, createAudit } = require("../post_execution_runner");
function fixture() {
  return { totalChecks: 1, passed: 1, failed: 0, allRequiredPassed: true,
    productionReady: false, results: [{ id: "check", required: true,
      status: "PASSED", evidence: { observed: true }, error: null }] };
}
test("valid evidence still cannot declare production readiness", () => {
  const audit = createAudit(fixture());
  assert.equal(audit.taskReportValid, true);
  assert.equal(audit.phaseARequiredChecksPassed, true);
  assert.equal(audit.productionReady, false);
  assert.equal(audit.releaseDecision, "NO_GO");
});
test("reject missing evidence", () => {
  const input = fixture(); input.results[0].evidence = null;
  assert.equal(validateTaskReport(input).valid, false);
});
test("reject falsified totals", () => {
  const input = fixture(); input.passed = 200;
  assert.equal(validateTaskReport(input).valid, false);
});
test("reject duplicate task IDs", () => {
  const input = fixture(); input.results.push({ ...input.results[0] });
  input.totalChecks = 2; input.passed = 2;
  assert.equal(validateTaskReport(input).valid, false);
});
test("failed required checks cannot pass audit", () => {
  const input = fixture();
  input.results[0] = { id: "check", required: true, status: "FAILED", evidence: null, error: "broken" };
  input.passed = 0; input.failed = 1; input.allRequiredPassed = false;
  assert.equal(createAudit(input).phaseARequiredChecksPassed, false);
});
