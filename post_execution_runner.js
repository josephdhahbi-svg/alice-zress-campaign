"use strict";
/**
 * Offline, non-deploying Phase B report validator.
 * Never claims production readiness without independent release gates.
 */
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const REPORT_PATH = path.join(__dirname, "omniversal_100_task_report.json");
const OUTPUT_PATH = path.join(__dirname, "omniversal_master_production_audit.json");
function validateTaskReport(report) {
  const errors = [];
  if (!report || typeof report !== "object" || !Array.isArray(report.results)) {
    return { valid: false, errors: ["Missing results array"] };
  }
  const ids = new Set();
  for (const item of report.results) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id)) errors.push("Invalid or duplicate check ID");
    if (item?.id) ids.add(item.id);
    if (!["PASSED", "FAILED", "SKIPPED", "UNCONFIGURED", "BLOCKED"].includes(item?.status)) errors.push("Invalid status for " + item?.id);
    if (item?.status === "PASSED" && (item.evidence === null || item.evidence === undefined)) errors.push("Missing passing evidence for " + item.id);
    if (item?.status === "FAILED" && !item.error) errors.push("Missing failure reason for " + item.id);
    if (item?.required !== true && item?.required !== false) errors.push("Missing required flag for " + item?.id);
  }
  const passed = report.results.filter(x => x.status === "PASSED").length;
  const failed = report.results.filter(x => x.status === "FAILED").length;
  if (report.totalChecks !== report.results.length) errors.push("Total check count mismatch");
  if (report.passed !== passed || report.failed !== failed) errors.push("Pass/fail count mismatch");
  const requiredPassed = report.results.every(x => !x.required || x.status === "PASSED");
  if (report.allRequiredPassed !== requiredPassed) errors.push("Required-check status mismatch");
  if (report.productionReady !== false) errors.push("Phase A cannot establish production readiness");
  return { valid: errors.length === 0, errors, requiredPassed, passed, failed };
}
function createAudit(report) {
  const validation = validateTaskReport(report);
  return {
    schemaVersion: 1,
    auditedAt: new Date().toISOString(),
    sourceCommitSha: report?.commitSha || null,
    taskReportValid: validation.valid,
    phaseARequiredChecksPassed: validation.valid && validation.requiredPassed === true,
    productionReady: false,
    releaseDecision: "NO_GO",
    reason: "Deployment, security, backup restoration, and operational readiness gates have not been verified",
    checked: { passed: validation.passed ?? 0, failed: validation.failed ?? 0 },
    validationErrors: validation.errors,
    integrations: {
      awsS3: "UNCONFIGURED", render: "UNCONFIGURED",
      sentry: "UNCONFIGURED", discordAlerts: "UNCONFIGURED",
      uptimeRobot: "UNCONFIGURED"
    }
  };
}
function main() {
  let report;
  try { report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8")); }
  catch (e) { console.error("Cannot read task report:", e.message); process.exitCode = 1; return; }
  const audit = createAudit(report);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(audit, null, 2) + "\n");
  console.log(JSON.stringify({ valid: audit.taskReportValid, releaseDecision: audit.releaseDecision }));
  if (!audit.taskReportValid || !audit.phaseARequiredChecksPassed) process.exitCode = 1;
}
if (require.main === module) main();
module.exports = { validateTaskReport, createAudit };
