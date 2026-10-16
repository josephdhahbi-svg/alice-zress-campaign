# Moonveil VTT — deployment readiness gate

**Current status: local-only prototype; not approved for public deployment.**

## Repository and local play
Repository: `josephdhahbi-svg/alice-zress-campaign`, development branch `feature/verified-automation-phase-a`.
Use Node.js 22+, then `npm install --no-audit --no-fund` and `npm test`. A committed lockfile is not yet present; generate and commit a reviewed `package-lock.json` before switching to reproducible `npm ci` builds. Start only with a locally generated secret of at least 24 characters:
```powershell
$env:MOONVEIL_DEV_TOKEN = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
$env:MOONVEIL_DB_PATH = "moonveil_vtt.db"
npm start
```
Open `http://127.0.0.1:3000/play/alice`. The UI requires a campaign ID and **signed actor access token** issued by the server; the administrator token is not an actor token. Do not paste secrets into source files, commit them, or share them.

## Why the provided cloud instructions are not sufficient
- GitHub Pages serves static files only. It cannot run Express, WebSockets, SQLite or authenticated gameplay.
- Current `server.js` explicitly binds to `127.0.0.1`. Cloud providers generally require binding to `0.0.0.0`, **but do not change this yet**.
- Current bearer development administrator secret and browser token-entry flow are not production-grade user authentication.
- SQLite WAL requires persistent storage, backups and single-writer deployment planning; ephemeral cloud disks lose campaign data.
- Hosting also requires HTTPS, secure WebSocket origin enforcement, trusted proxy configuration, request throttling, secret management, migrations, health probes and recovery testing.
- The monolithic v120 export must not replace the already-integrated authenticated server or overwrite campaign progression.
- Do not invent a public URL or claim deployment based on passing CI.

## Production release prerequisites
1. Implement production actor login/session issuance, CSRF/origin controls as appropriate, revocation and least-privilege DM access.
2. Review all REST and WebSocket routes for campaign isolation, authorization, validation and rate limiting.
3. Add a production-only explicit bind setting, HTTPS reverse proxy and health/readiness endpoints without exposing secrets.
4. Configure durable SQLite volume with WAL backup/restore and migration rollback tests, or migrate to a suitable managed database.
5. Add deployment-specific config only after host and storage selection; never include tokens in the repository.
6. Perform browser-based end-to-end tests and production security review before enabling external traffic.

CI workflow `.github/workflows/moonveil-deployment-readiness.yml` checks syntax and tests; **it does not deploy**.
