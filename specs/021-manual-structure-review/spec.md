# 021 — Manual structure review

FR-001 Given a local model and reference photos, when the garage opens, then show five manual comparison checkboxes.

FR-002 Given fewer than four checked items, when confirming, then confirmation is disabled. Four or five checked items require a separate explicit action.

FR-003 Given a model or photo change, when the review is revisited, then prior confirmations do not carry over.

FR-004 Given review input, when displayed, then it remains local and session-only; no model bytes or photos are changed.

Non-goals: automatic geometry reconstruction, authenticity certification, real-device parent approval.