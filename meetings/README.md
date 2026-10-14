# Campaign meetings and calendar

Daily development meetings are scheduled through ChatGPT for approximately **8:00 AM America/Los_Angeles** (flexible delivery, within about one hour). This repository stores the permanent **meeting record**, not the scheduler.

## Meeting workflow
1. Open a dated note in `meetings/YYYY/MM/YYYY-MM-DD.md`.
2. Record local start/end time with offset (ISO 8601), UTC time, participants, topics, links, and source of each decision.
3. Mark every statement as **proposed**, **approved**, **implemented**, or **verified**.
4. Record exact change: prior value → new value, rationale, affected record IDs, commit SHA, and rollback notes.
5. Assign actions, owners, target dates, status, and dependencies.
6. Finish with next meeting agenda and continuity questions.

## Time policy
- Real-world creation timestamp: ISO 8601 with offset, e.g. `2026-10-14T09:00:00-07:00`.
- Forgotten Realms in-world date: separate DR field; never mix with real-world date.
- Git commits supply a technical audit trail, but decisions also require meeting minutes.
- Do not invent meeting start/end times or assert a discussion happened when it did not.
- Earlier discussions can be marked `retrospective / date unverified` if exact timestamp is unavailable.

## Calendar
`calendar/daily-development.ics` is an importable daily event template for 8 AM Pacific. It does **not** automatically sync with Google Calendar. The ChatGPT daily meeting automation is a separate recurring task.
