# Social Content Pipeline: Slack to LinkedIn/X

Automated 4-agent workflow that monitors Slack for interesting content, drafts social media posts using Claude, gets human approval, and publishes to LinkedIn and X.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Agent 1:       │     │  Agent 2:       │     │  Agent 3:       │     │  Agent 4:       │
│  Slack Scanner  │────>│  Content        │────>│  Approval       │────>│  Posting        │
│                 │     │  Creator        │     │  (Human Loop)   │     │  Agent          │
│  Runs 3x/day   │     │  Claude API     │     │  Slack React    │     │  LinkedIn + X   │
│  9am, 1pm, 5pm │     │  Drafts posts   │     │  Approve/Reject │     │  API calls      │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

## What Each Agent Does

### Agent 1: Slack Scanner (Claude API)
- **Trigger**: Cron schedule — 9am, 1pm, 5pm ET
- **Input**: Last 8 hours of Slack messages from configured channels
- **Claude's job**: Identify post-worthy topics across 5 categories:
  - Client questions (pain points, common misconceptions)
  - Exciting wins (results, ROAS, traffic gains)
  - Strategies that work (tactics producing results)
  - Case studies (before/after, transformations)
  - Industry commentary (algorithm changes, trends, hot takes)
- **Output**: JSON array of scored topics with anonymized summaries

### Agent 2: Content Creator (Claude API)
- **Input**: Each topic from Agent 1 + any screenshots
- **Claude's job**: Write platform-specific posts
  - LinkedIn: Hook-first, line breaks, 150-300 words, 3-5 hashtags
  - X: Under 280 chars, optional thread for longer stories, 1-2 hashtags
- **Output**: JSON with both platform posts, image instructions, posting notes

### Agent 3: Approval Agent (Code Node + Slack)
- **Input**: Draft posts from Agent 2
- **Action**: Formats a clean Slack message and sends to approval channel
- **Human step**: React with checkmark to approve, pencil for edits, X to reject
- **Output**: Triggers the posting workflow on approval

### Agent 4: Posting Agent (HTTP Requests)
- **Input**: Approved post content
- **Action**: Posts to LinkedIn API and X API
- **Output**: Confirmation message back to Slack

## Setup Guide

### Prerequisites
- n8n instance (you have: digitalposition.app.n8n.cloud)
- Anthropic API key (you have this from Content Research Tool)
- Slack Bot Token with these scopes:
  - `channels:history` — read messages
  - `chat:write` — post messages
  - `reactions:read` — detect approval reactions
  - `files:read` — access screenshots/attachments
- LinkedIn API access (OAuth2)
- X/Twitter API access (OAuth2)

### Step 1: Import the Workflow

1. Go to your n8n instance
2. Click **Add Workflow** > **Import from File**
3. Select `workflows/slack-to-social-pipeline.json`
4. The workflow will appear with all nodes pre-configured

### Step 2: Configure Credentials

In n8n, go to **Settings > Credentials** and add:

#### Anthropic API
- **Type**: Header Auth
- **Header Name**: `x-api-key`
- **Header Value**: Your Anthropic API key
- This is used by Agent 1 (Scanner) and Agent 2 (Content Creator)

#### Slack API
- **Type**: Slack OAuth2
- **Bot Token**: Your Slack bot token (`xoxb-...`)
- Install the Slack app to your workspace first
- Required scopes: `channels:history`, `chat:write`, `reactions:read`, `files:read`

#### LinkedIn OAuth2
- **Type**: OAuth2
- **Client ID**: From LinkedIn Developer Portal
- **Client Secret**: From LinkedIn Developer Portal
- **Scope**: `w_member_social` (or `w_organization_social` for company page)
- **Auth URL**: `https://www.linkedin.com/oauth/v2/authorization`
- **Token URL**: `https://www.linkedin.com/oauth/v2/accessToken`

#### X/Twitter OAuth2
- **Type**: OAuth2
- **Client ID**: From X Developer Portal
- **Client Secret**: From X Developer Portal
- **Scope**: `tweet.write tweet.read users.read`

### Step 3: Configure Channel IDs

1. Open the **Set Slack Channels** node
2. Replace `C_CHANNEL_ID_1`, `C_CHANNEL_ID_2`, etc. with your actual Slack channel IDs
3. To find a channel ID: right-click the channel in Slack > **View channel details** > scroll to bottom

Recommended channels to monitor:
- Your team's wins/results channel
- Client strategy channels
- General marketing discussion
- Industry news channel

4. Set the **APPROVAL_CHANNEL_ID** in the approval nodes to the channel where you want drafts sent for review

### Step 4: Set Environment Variables

In n8n Settings, add:
- `LINKEDIN_ORG_ID` — Your LinkedIn Organization ID (found in LinkedIn Company Page URL)

### Step 5: Create the Approval Workflow

The approval reaction listener needs to be a **separate workflow** in n8n:

1. Create a new workflow called "Social Post Approval Handler"
2. Use the **Slack Trigger** node set to listen for `reaction_added` events
3. Filter for reactions on messages from your bot in the approval channel
4. On checkmark reaction: fetch the original post data and route to LinkedIn/X posting nodes
5. On X reaction: log and skip

### Step 6: Test the Pipeline

1. **Manual test**: Click "Execute Workflow" on the main pipeline
2. **Check Agent 1**: Verify it reads Slack messages and identifies topics
3. **Check Agent 2**: Verify it creates well-formatted posts
4. **Check Agent 3**: Verify the Slack approval message looks clean
5. **Test approval**: React to a test message and verify it flows through

### Step 7: Activate

Once tested, click **Active** toggle on both workflows to run on schedule.

## Customization

### Adjust Scan Frequency
Edit the Schedule Trigger node — change the hours array to run at different times.

### Add More Channels
Add channel IDs to the array in the "Set Slack Channels" node.

### Modify Post Style
Edit the system prompts in `prompts/agent2-content-creator.md`. You can adjust:
- Brand voice guidelines
- Post length preferences
- Hashtag strategy
- Platform-specific formatting

### Change Approval Flow
You can swap emoji reactions for Slack Block Kit buttons for a more polished UX. This requires a Slack app with interactivity enabled.

## File Structure

```
social-content-pipeline/
├── README.md                              # This file
├── workflows/
│   └── slack-to-social-pipeline.json      # n8n importable workflow
└── prompts/
    ├── agent1-slack-scanner.md            # Claude system prompt for scanning
    ├── agent2-content-creator.md          # Claude system prompt for writing
    ├── agent3-approval.md                 # Approval message formatting spec
    └── agent4-posting.md                  # Posting agent spec
```

## Cost Estimate

Per run (3x daily = ~90 runs/month):
- **Agent 1** (Sonnet): ~500 input tokens + ~1000 output tokens = ~$0.005/run
- **Agent 2** (Sonnet): ~1000 input tokens + ~2000 output tokens per topic = ~$0.01/topic
- **Estimated monthly**: $5-15 depending on topics found

## Troubleshooting

- **No topics found**: Check that the Slack channels have recent messages and the channel IDs are correct
- **Claude returns unparseable JSON**: The Code nodes handle markdown-wrapped JSON, but check the raw output in n8n execution logs
- **LinkedIn post fails**: Token may have expired — LinkedIn tokens expire every 60 days, refresh in n8n credentials
- **Slack bot can't read messages**: Ensure the bot is added to each channel you want to monitor
