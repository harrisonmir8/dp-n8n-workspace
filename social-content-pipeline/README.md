# Social Content Pipeline: Slack → LinkedIn/X

Automated pipeline that monitors Slack 3x/day for post-worthy content, uses Claude to draft social posts, gets human approval via Slack reactions, and publishes to LinkedIn and X.

## Architecture

```
  Workflow 1: Scan + Draft                    Workflow 2: Approve + Post
  ─────────────────────────                   ──────────────────────────
  
  ┌──────────┐  ┌──────────┐  ┌──────────┐   ┌──────────┐  ┌──────────┐
  │ Cron     │→ │ Read     │→ │ Agent 1: │   │ Slack    │→ │ Extract  │
  │ 9am/1/5  │  │ Slack    │  │ Claude   │   │ Reaction │  │ Post     │
  │          │  │ Messages │  │ Scan     │   │ Trigger  │  │ Content  │
  └──────────┘  └──────────┘  └──────────┘   └──────────┘  └──────────┘
                                   │                             │
                              ┌──────────┐               ┌──────────────┐
                              │ Agent 2: │               │ Post to      │
                              │ Claude   │               │ LinkedIn + X │
                              │ Write    │               └──────────────┘
                              └──────────┘                      │
                                   │                     ┌──────────────┐
                              ┌──────────┐               │ Confirm in   │
                              │ Agent 3: │               │ Slack Thread │
                              │ Send to  │               └──────────────┘
                              │ Slack    │
                              └──────────┘
```

## Quick Start

**See `SETUP-CHECKLIST.md` for the full step-by-step setup guide (~2 hours).**

Phase 1 (scanning + drafts to Slack) works with just Slack + Anthropic API keys.
Phase 2 (auto-posting) adds LinkedIn and X API credentials.

## Files

```
social-content-pipeline/
├── SETUP-CHECKLIST.md                          # Step-by-step setup (~2 hours)
├── README.md                                   # This file
├── .env.example                                # Required API keys reference
├── workflows/
│   ├── workflow-1-scan-and-draft.json          # n8n import: scan Slack + write posts
│   └── workflow-2-approval-and-post.json       # n8n import: approve + publish
└── prompts/
    ├── agent1-slack-scanner.md                 # Full scanner prompt (reference)
    ├── agent2-content-creator.md               # Full writer prompt (reference)
    ├── agent3-approval.md                      # Approval format spec (reference)
    └── agent4-posting.md                       # Posting agent spec (reference)
```

Note: The Claude prompts are inlined directly into the workflow JSON (in the CONFIG node). The `prompts/` folder is the full reference version for editing and version control.

## Cost

~$5-15/month in Claude API costs (Sonnet, 3 scans/day).

## Troubleshooting

| Problem | Fix |
|---|---|
| "channel_not_found" | Bot isn't invited to channel, or wrong channel ID |
| "invalid_api_key" | Check Anthropic credential in n8n |
| No topics found | Channels may be quiet — add more channels or widen time window |
| Claude returns bad JSON | Code nodes handle markdown fences — check n8n execution logs |
| LinkedIn 401 | Token expired (60-day limit) — refresh in n8n credentials |
