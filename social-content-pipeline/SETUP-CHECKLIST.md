# Setup Checklist — Social Content Pipeline

Two n8n workflows. ~2 hours to set up. Do it in order.

---

## Phase 1: Slack + Claude (scanning + drafting) — ~45 min

This gets you to the point where posts draft themselves and show up in Slack for review. No social API setup needed yet.

### Step 1: Create a Slack App (15 min)

1. Go to https://api.slack.com/apps
2. Click **Create New App** > **From scratch**
3. Name it `Social Content Bot`, pick your workspace
4. Go to **OAuth & Permissions** > **Scopes** > **Bot Token Scopes**, add:
   - `channels:history`
   - `channels:read`
   - `chat:write`
   - `reactions:read`
   - `files:read`
5. Click **Install to Workspace** at the top
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
7. Go to each Slack channel you want to monitor, type `/invite @Social Content Bot`

### Step 2: Get Your Slack Channel IDs (5 min)

For each channel you want to scan:
1. Open the channel in Slack
2. Click the channel name at the top
3. Scroll to the bottom of the modal — the Channel ID is there (starts with `C`)
4. Write them down:
   - Channel 1: `C__________` (e.g. #wins)
   - Channel 2: `C__________` (e.g. #strategy)  
   - Channel 3: `C__________` (e.g. #general)
   - Approval Channel: `C__________` (where drafts get sent for review)

### Step 3: Set Up n8n Credentials (10 min)

Go to https://digitalposition.app.n8n.cloud

**Slack credential:**
1. Go to **Settings** (gear icon) > **Credentials** > **Add Credential**
2. Search for **Slack API**
3. Paste your Bot Token (`xoxb-...`)
4. Click **Save**. Note the credential name.

**Anthropic API credential:**
1. **Add Credential** > search for **Header Auth**
2. Name: `Anthropic API`
3. Header Name: `x-api-key`
4. Header Value: Your Anthropic API key (`sk-ant-...`)
5. Click **Save**

Also add a second header auth or edit the request nodes to include:
- Header: `anthropic-version` = `2023-06-01`  
- Header: `content-type` = `application/json`

(These are already in the HTTP Request node headers — you just need the credential for the API key.)

### Step 4: Import Workflow 1 (10 min)

1. In n8n, click **Add Workflow** (+ button)
2. Click the **...** menu > **Import from File**
3. Select `workflows/workflow-1-scan-and-draft.json`
4. The workflow appears with all nodes connected

**Now configure it:**

5. Click the **CONFIG — Edit This Node** node:
   - Replace `CHANNEL_ID_1`, `CHANNEL_ID_2` with your real channel IDs
   - Replace `APPROVAL_CHANNEL_ID` with your approval channel
   - The prompts are pre-filled — you can tweak them later

6. Click each **Slack** node (Read Slack Messages, Send to Slack, Notify: No Topics):
   - Select your Slack credential from the dropdown

7. Click each **Agent** node (Agent 1: Scan Topics, Agent 2: Write Posts):
   - Select your Anthropic API credential from the dropdown
   - Verify the headers include `anthropic-version` and `content-type`

### Step 5: Test It (5 min)

1. Click **Test Workflow** (play button at bottom)
2. Watch each node execute left to right
3. Click any node to see its output
4. If it works, you'll see a formatted post draft appear in your Slack approval channel

**Common issues:**
- "channel_not_found" → Bot isn't invited to the channel, or wrong channel ID
- "invalid_api_key" → Check your Anthropic credential
- No topics found → If the channels are quiet, try adding more channels or adjusting the time window

### Step 6: Activate

Toggle the workflow **Active** (top right). It now runs at 9am, 1pm, 5pm ET automatically.

---

## Phase 2: Approval + Auto-Posting — ~1 hour

### Step 7: Enable Slack Events (10 min)

Your Slack app needs to send events to n8n for the reaction trigger to work.

1. In n8n, drag a **Slack Trigger** node onto a blank workflow
2. It will show you a **Webhook URL** — copy it
3. Go to https://api.slack.com/apps > your app > **Event Subscriptions**
4. Toggle **Enable Events** on
5. Paste the webhook URL in **Request URL** — Slack will verify it
6. Under **Subscribe to bot events**, add:
   - `reaction_added`
7. Click **Save Changes**
8. You may need to **reinstall the app** (OAuth & Permissions > Reinstall)

### Step 8: Set Up LinkedIn API (30 min)

This is the longest step. LinkedIn's API requires an app + OAuth.

1. Go to https://www.linkedin.com/developers/apps
2. **Create App**:
   - App name: `DP Social Pipeline`
   - LinkedIn Page: Select your Digital Position company page
   - App logo: Any image
3. After creation, go to **Auth** tab:
   - Note your **Client ID** and **Client Secret**
4. Go to **Products** tab:
   - Request access to **Share on LinkedIn** (may require admin approval)
   - Request access to **Sign In with LinkedIn using OpenID Connect**
5. In **Auth** tab > **OAuth 2.0 scopes**, ensure you have:
   - `w_member_social` (personal posting) OR `w_organization_social` (company page posting)

**In n8n:**
6. **Add Credential** > search for **Header Auth**
7. Name: `LinkedIn Token`
8. For now, you'll need to get a token manually:
   - In LinkedIn Developer portal > **Auth** > **OAuth 2.0 tools**
   - Generate a token with the right scopes
   - Paste it as: Header Name = `Authorization`, Value = `Bearer YOUR_TOKEN`
   
   Note: LinkedIn tokens expire in 60 days. For production, use n8n's OAuth2 credential type to auto-refresh.

9. Find your **Organization ID**:
   - Go to your LinkedIn Company Page
   - The URL is `linkedin.com/company/XXXXXXX/` — that number is your Org ID

### Step 9: Set Up X/Twitter API (20 min)

1. Go to https://developer.x.com/en/portal/dashboard
2. Create a project + app if you haven't already
3. You need **OAuth 2.0** with **User authentication** enabled:
   - Type: Web App
   - Callback URL: `https://digitalposition.app.n8n.cloud/rest/oauth2-credential/callback`
   - Scopes: `tweet.read`, `tweet.write`, `users.read`
4. Note your **Client ID** and **Client Secret**

**In n8n:**
5. **Add Credential** > search for **OAuth2 API**
6. Configure:
   - Client ID: from X developer portal
   - Client Secret: from X developer portal  
   - Authorization URL: `https://twitter.com/i/oauth2/authorize`
   - Access Token URL: `https://api.x.com/2/oauth2/token`
   - Scope: `tweet.read tweet.write users.read offline.access`
7. Click **Connect** — it will redirect you to authorize

### Step 10: Import Workflow 2 (10 min)

1. Import `workflows/workflow-2-approval-and-post.json`
2. Configure credentials on each node (same process as workflow 1)
3. In the **Post to LinkedIn** node:
   - Replace `YOUR_LINKEDIN_ORG_ID` in the JSON body with your actual org ID
4. Test by reacting with :white_check_mark: on a draft message in Slack
5. Activate the workflow

---

## You're Done!

The pipeline now:
- Scans Slack 3x daily for interesting content
- Claude writes LinkedIn + X post drafts  
- Sends drafts to your Slack channel for review
- You react with :white_check_mark: to approve
- It auto-posts to LinkedIn and X
- Confirms back in Slack thread

---

## Quick Tuning Guide

| Want to change... | Do this |
|---|---|
| Scan frequency | Edit the Schedule Trigger node hours |
| Which channels to scan | Edit the CONFIG node channel array |
| What topics Claude looks for | Edit the `scanner_prompt` in CONFIG node |
| How posts are written | Edit the `creator_prompt` in CONFIG node |
| Post to LinkedIn only (skip X) | Delete the "Post to X" node and its connection |
| Add more approval options | Modify the "Is Checkmark?" node conditions |
