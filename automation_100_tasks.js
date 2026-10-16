"use strict";
/**
 * Phase A: evidence-based, allowlisted checks. No deployments, arbitrary task
 * generation, external writes, or access to live databases.
 * Run: node automation_100_tasks.js
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { performance } = require("node:perf_hooks");

const ROOT = __dirname;
const REPORT = path.join(ROOT, "omniversal_100_task_report.json");
const MAX_RETRIES = 1;
const TIMEOUT_MS = 120000;

function runCommand(command, args, timeoutMs = TIMEOUT_MS) {
  return new Promise(resolve => {
    const child = spawn(command, args, { cwd: ROOT, shell: false, windowsHide: true,
      env: { ...process.env, CI: "true" } });
    let stdout = "", stderr = "", settled = false, timedOut = false;
    const append = (old, chunk) => (old + String(chunk)).slice(-12000);
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, timeoutMs);
    child.stdout.on("data", c => { stdout = append(stdout, c); });
    child.stderr.on("data", c => { stderr = append(stderr, c); });
    function finish(result) {
      if (settled) return;
      settled = true; clearTimeout(timer);
      resolve({ ...result, stdout, stderr, timedOut });
    }
    child.on("error", e => finish({ success: false, error: e.message }));
    child.on("close", code => finish({
      success: !timedOut && code === 0, exitCode: code,
      error: timedOut ? "TIMEOUT" : code === 0 ? null : "EXIT_NONZERO"
    }));
  });
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
const registry = [
  { id: "manifest", name: "Package manifest and test script", required: true, run: async () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    assert(manifest.scripts && typeof manifest.scripts.test === "string", "Missing npm test script");
    assert(manifest.dependencies?.["better-sqlite3"], "Missing SQLite dependency");
    return { package: manifest.name, version: manifest.version, testScript: manifest.scripts.test };
  }},
  { id: "backend-files", name: "Critical backend modules exist", required: true, run: async () => {
    const paths = ["server.js", "backend/migrations.js", "backend/session-auth.js",
      "backend/backup-service.js", "backend/faction-pulse.js"];
    for (const file of paths) assert(fs.statSync(path.join(ROOT, file)).isFile(), "Missing " + file);
    return { checkedFiles: paths };
  }},
  { id: "migration-registry", name: "Migration versions unique and ordered", required: true, run: async () => {
    const { MIGRATIONS } = require("./backend/migrations");
    assert(Array.isArray(MIGRATIONS) && MIGRATIONS.length > 0, "No migrations");
    const versions = MIGRATIONS.map(m => m.version);
    assert(versions.every((v, i) => Number.isSafeInteger(v) && v > 0 &&
      (i === 0 || v > versions[i - 1])), "Migration versions not strictly increasing");
    return { versions };
  }},
  { id: "node-tests", name: "Execute existing Node test suite", required: true,
    run: async () => {
      const result = await runCommand(process.execPath,
        ["--test", ...fs.readdirSync(path.join(ROOT, "backend"))
          .filter(f => f.endsWith(".test.js")).sort().map(f => path.join("backend", f))]);
      if (!result.success) throw new Error(result.error + ": " + result.stderr.slice(-2500));
      return { exitCode: result.exitCode, outputTail: result.stdout.slice(-2000) };
    }
  }
];

async function execute(registryItems = registry, { retries = MAX_RETRIES, timeoutMs = TIMEOUT_MS } = {}) {
  const results = [];
  for (const task of registryItems) {
    const startedAt = new Date().toISOString(), start = performance.now();
    let status = "FAILED", evidence = null, error = null, attempts = 0;
    for (let attempt = 0; attempt <= retries; attempt++) {
      attempts++;
      try {
        // Timeout bounds async tasks. Child processes also have an explicit kill timer.
        let timer;
        try {
          evidence = await Promise.race([
            Promise.resolve().then(() => task.run()),
            new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs); })
          ]);
        } finally { clearTimeout(timer); }
        status = "PASSED"; error = null; break;
      } catch (e) { error = String(e?.message || e).slice(0, 3000); }
    }
    results.push({ id: task.id, name: task.name, required: task.required,
      status, attempts, startedAt, durationMs: Math.round(performance.now() - start),
      evidence: status === "PASSED" ? evidence : null, error });
  }
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    commitSha: process.env.GITHUB_SHA || null,
    totalChecks: results.length, passed: results.filter(r => r.status === "PASSED").length,
    failed: results.filter(r => r.status === "FAILED").length,
    allRequiredPassed: results.every(r => !r.required || r.status === "PASSED"),
    productionReady: false,
    productionReadyReason: "Phase A checks alone do not establish deployment readiness",
    results };
}
async function main() {
  const report = await execute();
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  process.stdout.write(JSON.stringify({ passed: report.passed, total: report.totalChecks,
    report: path.basename(REPORT), allRequiredPassed: report.allRequiredPassed }) + "\n");
  if (!report.allRequiredPassed) process.exitCode = 1;
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { execute, registry, runCommand };
