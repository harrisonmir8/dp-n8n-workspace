# Social Content Pipeline — Detailed Setup Guide

---

## PHASE 1: Slack Scanning + Post Drafting (~45 min)

After this phase, Claude will scan your Slack 3x/day and send you draft social posts for review.

---

### STEP 1: Create the Slack App

Go to https://api.slack.com/apps and click "Create New App" then "From scratch."

**App Name:** `Social Content Bot`
**Workspace:** Select your Digital Position workspace

Once created, you land on the app's "Basic Information" page. Now configure it:

**Add Bot Permissions:**
- In the left sidebar, click "OAuth & Permissions"
- Scroll down to the "Scopes" section
- Under "Bot Token Scopes", click "Add an OAuth Scope" and add each of these one at a time:
  - `channels:history` — lets the bot read messages in public channels
  - `channels:read` — lets the bot see channel info and list channels
  - `chat:write` — lets the bot send messages (for approval drafts and confirmations)
  - `reactions:read` — lets the bot see when you react with a checkmark to approve
  - `files:read` — lets the bot access screenshots and attachments shared in channels

**Install the App:**
- Scroll back to the top of the "OAuth & Permissions" page
- Click the green "Install to Workspace" button
- Slack will ask you to authorize — click "Allow"
- You'll be redirected back and now see a "Bot User OAuth Token" — it starts with `xoxb-`
- **Copy this token and save it somewhere** — you'll paste it into n8n in Step 3

**Invite the Bot to Your Channels:**
- Go to Slack (the regular app, not the API site)
- Open each channel you want the bot to scan (your wins channel, strategy channel, general marketing channel, etc.)
- In each channel, type `/invite @Social Content Bot` and press Enter
- Also create or pick a channel for approvals (e.g. `#social-drafts`) and invite the bot there too

---

### STEP 2: Collect Your Slack Channel IDs

You need the internal ID for each channel (not the channel name). For each channel:

- Open the channel in Slack
- Click the channel name at the very top of the conversation (this opens the channel details panel)
- Scroll to the very bottom of that panel
- You'll see "Channel ID: C0XXXXXXX" — copy that

Write down each one:

```
Channels to scan:
  #wins           → C_______________
  #strategy       → C_______________
  #general        → C_______________
  (add more as needed)

Approval channel:
  #social-drafts  → C_______________
```

You'll plug these into n8n in Step 4.

---

### STEP 3: Add Credentials to n8n

Go to https://digitalposition.app.n8n.cloud and log in.

**Add the Slack credential:**
- Click the gear icon (Settings) in the bottom-left corner
- Click "Credentials" in the left menu
- Click the orange "Add Credential" button in the top right
- In the search box, type `Slack API` and select it
- You'll see a field for "Access Token" — paste your `xoxb-` bot token from Step 1
- Click "Save" in the top right
- The credential will be named something like "Slack account" — remember this name

**Add the Anthropic API credential:**
- Click "Add Credential" again
- Search for `Header Auth` and select it
- **Name field** (top of the form): change it to `Anthropic API`
- **Name** (in the parameters section): enter `x-api-key`
- **Value**: paste your Anthropic API key (starts with `sk-ant-`)
- Click "Save"

You should now see both credentials listed — "Slack account" and "Anthropic API."

---

### STEP 4: Import and Configure Workflow 1

**Import the workflow file:**
- Click "Workflows" in the left sidebar (or the n8n logo to go home)
- Click the orange "Add Workflow" button
- In the new empty workflow, click the three-dot menu (⋯) in the top right area
- Click "Import from File"
- Navigate to and select the file: `social-content-pipeline/workflows/workflow-1-scan-and-draft.json`
- The workflow will load with 11 nodes already connected

**Configure the CONFIG node (your channel IDs and prompts):**
- You'll see a node labeled "CONFIG — Edit This Node" near the left side of the workflow
- Double-click it to open it
- You'll see 4 fields:
  - **channels**: Replace `CHANNEL_ID_1` and `CHANNEL_ID_2` with your actual channel IDs from Step 2. If you have 3 channels, the value should look like: `={{ ['C0ABC1234', 'C0DEF5678', 'C0GHI9012'] }}`
  - **approval_channel**: Replace `APPROVAL_CHANNEL_ID` with your approval channel ID, e.g. `C0XYZ7890`
  - **scanner_prompt**: This is pre-filled with the Claude prompt that tells it what to look for in Slack. You can leave it as-is for now and tune it later.
  - **creator_prompt**: This is pre-filled with the Claude prompt that tells it how to write LinkedIn and X posts. Leave it as-is for now.
- Click "Back" or close the panel when done

**Connect the Slack credential to all Slack nodes:**
- Double-click the "Read Slack Messages" node
- At the top, you'll see "Credential to connect with" — it may show a red warning
- Click the dropdown and select your "Slack account" credential
- Close the node
- Repeat this for "Send to Slack for Approval" node — same thing, select "Slack account"
- Repeat for "Notify: No Topics" node — select "Slack account"

**Connect the Anthropic credential to both Claude nodes:**
- Double-click "Agent 1: Scan Topics"
- Under "Authentication", it should say "Generic Credential Type" and then "Header Auth"
- In the "Header Auth" credential dropdown, select "Anthropic API"
- You also need to manually add two headers. Scroll down to "Headers" or "Send Headers" and make sure these exist:
  - Header name: `anthropic-version` — Value: `2023-06-01`
  - Header name: `content-type` — Value: `application/json`
- Close the node
- Repeat the exact same process for "Agent 2: Write Posts" — select "Anthropic API" credential and verify the two headers

**Name your workflow:**
- Click the workflow name at the top (probably says "Social Pipeline: Scan Slack + Draft Posts")
- You can keep this name or change it to whatever you want

---

### STEP 5: Test the Workflow

Before you turn it on for real, run it manually to make sure everything connects:

- Click the "Test Workflow" button (the play button at the bottom center of the canvas)
- Watch the nodes light up one by one from left to right:
  - **3x Daily Trigger** → fires immediately in test mode
  - **CONFIG** → passes your settings through
  - **Split Channels** → splits your channel array into individual items
  - **Read Slack Messages** → pulls the last 8 hours of messages from each channel
  - **Merge Messages** → combines all messages into one array
  - **Agent 1: Scan Topics** → sends messages to Claude, waits ~10 seconds for response
  - **Parse Topics** → extracts the topics Claude found
  - **Topics Found?** → routes to content creation or "no topics"
  - **Agent 2: Write Posts** → Claude writes the LinkedIn + X posts
  - **Agent 3: Format for Approval** → formats the Slack message
  - **Send to Slack for Approval** → posts to your approval channel

- Click on any node to see its output data
- Check your Slack approval channel — you should see a formatted draft post

**If "Read Slack Messages" fails with "channel_not_found":**
- Double check the channel IDs are correct (they're case-sensitive)
- Make sure the bot was invited to each channel with `/invite @Social Content Bot`

**If "Agent 1: Scan Topics" fails with 401:**
- Your Anthropic API key is wrong — go back to credentials and re-enter it
- Make sure the header name is exactly `x-api-key` (lowercase, with hyphens)

**If it works but "Topics Found?" routes to "No Topics":**
- Your channels may not have had interesting enough content in the last 8 hours
- This is normal — Claude is being selective. Try adding more active channels.

---

### STEP 6: Activate the Schedule

Once your test passes:

- Toggle the "Active" switch in the top-right corner of the workflow to ON
- The workflow will now run automatically at 9am, 1pm, and 5pm Eastern
- To change the times: double-click the "3x Daily Trigger" node and edit the hours
- To change the timezone: go to n8n Settings > General > Timezone

**Phase 1 is done.** Your Slack channels are being scanned and draft posts show up for review. You can use Phase 1 on its own — just manually copy/paste the drafts to LinkedIn and X if you want to skip Phase 2.

---

## PHASE 2: Auto-Posting After Approval (~1 hour)

After this phase, reacting with a checkmark emoji in Slack will automatically publish to LinkedIn and X.

---

### STEP 7: Enable Slack Event Subscriptions

Right now your Slack bot can read messages and post messages, but it can't detect when you react to a message. You need to enable "Event Subscriptions" so Slack sends a notification to n8n when someone adds a reaction.

**Get the webhook URL from n8n:**
- In n8n, create a new blank workflow (you'll build workflow 2 here, or you can import it — but first you need the webhook URL)
- Drag a "Slack Trigger" node onto the canvas from the node panel
- Double-click it
- Select your "Slack account" credential
- Under events, select "reaction_added"
- n8n will display a "Webhook URL" at the top of the node — it looks like `https://digitalposition.app.n8n.cloud/webhook/xxxxx`
- **Copy this URL**

**Configure Slack to send events:**
- Go to https://api.slack.com/apps and click on your "Social Content Bot" app
- In the left sidebar, click "Event Subscriptions"
- Toggle "Enable Events" to ON
- In the "Request URL" field, paste the webhook URL you just copied from n8n
- Slack will send a verification request — if n8n is running and the Slack Trigger node is listening, it should verify automatically (you'll see a green checkmark and "Verified")
- If verification fails: make sure the workflow with the Slack Trigger node is saved and the trigger node is active. Try toggling the workflow Active, then re-enter the URL.
- Scroll down to "Subscribe to bot events"
- Click "Add Bot User Event"
- Add: `reaction_added`
- Click "Save Changes" at the bottom

**Reinstall the app (required after adding events):**
- Go to "OAuth & Permissions" in the left sidebar
- Click "Reinstall to Workspace" at the top
- Click "Allow"
- Your bot token stays the same — no need to update n8n

---

### STEP 8: Set Up LinkedIn API Access

This is the most involved step. LinkedIn requires you to create a developer app, get approved for posting access, and generate a token.

**Create a LinkedIn Developer App:**
- Go to https://www.linkedin.com/developers/apps
- Click "Create App"
- Fill in:
  - **App name**: `DP Social Pipeline`
  - **LinkedIn Page**: Search for and select "Digital Position" (your company page). You must be an admin of this page.
  - **Privacy policy URL**: Enter your website privacy policy URL (e.g. `https://digitalposition.com/privacy`)
  - **App logo**: Upload any square image (it's required but doesn't matter)
- Click "Create App"

**Request API Product Access:**
- On your new app's page, click the "Products" tab
- Find "Share on LinkedIn" and click "Request Access"
- Accept the terms — this usually gets approved instantly for company page admins
- Also request "Sign In with LinkedIn using OpenID Connect" (needed for the OAuth flow)
- Wait a few minutes for both to show as "Added" under your Products tab

**Verify Your Scopes:**
- Click the "Auth" tab
- Under "OAuth 2.0 scopes" you should see:
  - `w_member_social` — lets you post as yourself
  - If you want to post as the company page: you need `w_organization_social` — this requires applying to LinkedIn's Community Management API (takes longer to approve). Start with personal posting for now.

**Generate an Access Token:**
- Still on the "Auth" tab, note your **Client ID** and **Client Secret**
- Click the "OAuth 2.0 tools" link (or go to https://www.linkedin.com/developers/tools/oauth)
- Select your app
- Select the scopes: `w_member_social`, `openid`, `profile`
- Click "Request access token"
- You'll be redirected to authorize — click Allow
- You'll receive an **Access Token** — copy it
- This token is valid for 60 days. You'll need to regenerate it when it expires.

**Find Your LinkedIn Organization ID (for company page posting):**
- Go to your LinkedIn Company Page in a browser
- Look at the URL: `https://www.linkedin.com/company/12345678/`
- That number (`12345678`) is your Organization ID
- If you're posting as yourself (not the company), you'll use your personal URN instead — the token generation page shows your member ID

**Add LinkedIn credential to n8n:**
- In n8n, go to Settings > Credentials > Add Credential
- Search for `Header Auth` and select it
- **Name**: `LinkedIn Token`
- **Name** (parameter): `Authorization`
- **Value**: `Bearer YOUR_ACCESS_TOKEN` (paste the token after "Bearer ", with a space between them)
- Click Save

---

### STEP 9: Set Up X/Twitter API Access

**Get Developer Access:**
- Go to https://developer.x.com/en/portal/dashboard
- If you don't have a developer account yet, sign up — you'll need to describe your use case (say "automated social media posting for a marketing agency")
- Once in the dashboard, you should have a Project. If not, create one.

**Create or Configure Your App:**
- Under your Project, click on your App (or create a new one)
- Go to "Settings" > "User authentication settings" > click "Set up"
- Configure:
  - **App permissions**: Select "Read and write"
  - **Type of App**: Select "Web App, Automated App or Bot"
  - **Callback URI**: Enter `https://digitalposition.app.n8n.cloud/rest/oauth2-credential/callback`
  - **Website URL**: Enter `https://digitalposition.com`
- Click "Save"

**Get Your Keys:**
- Go to "Keys and Tokens" tab
- Under "OAuth 2.0 Client ID and Client Secret":
  - Copy the **Client ID**
  - Click "Regenerate" on Client Secret if needed, then copy the **Client Secret**

**Add X credential to n8n:**
- In n8n, go to Settings > Credentials > Add Credential
- Search for `OAuth2 API` and select it
- **Name**: `X/Twitter OAuth2`
- Fill in these fields:
  - **Grant Type**: Authorization Code
  - **Authorization URL**: `https://twitter.com/i/oauth2/authorize`
  - **Access Token URL**: `https://api.x.com/2/oauth2/token`
  - **Client ID**: paste your Client ID from X
  - **Client Secret**: paste your Client Secret from X
  - **Scope**: `tweet.read tweet.write users.read offline.access`
  - **Auth URI Query Parameters**: Add parameter `code_challenge_method` with value `plain`
  - **Authentication**: Select "Body"
- Click "Connect my account" — a popup will open asking you to authorize on X
- Log in and click "Authorize app"
- The popup should close and the credential should show as connected
- Click "Save"

---

### STEP 10: Import and Configure Workflow 2

**Import the workflow:**
- If you created a blank workflow in Step 7 with the Slack Trigger, delete it (you'll import the full one)
- Create a new workflow
- Click ⋯ menu > "Import from File"
- Select `social-content-pipeline/workflows/workflow-2-approval-and-post.json`

**Connect credentials to every node:**
- **Slack Reaction Trigger** — select your "Slack account" credential, set event to `reaction_added`
- **Get Original Message** — select "Slack account"
- **Post to LinkedIn** — select "LinkedIn Token" (Header Auth)
- **Post to X** — select "X/Twitter OAuth2" (OAuth2 API)
- **Confirm in Slack** — select "Slack account"

**Set your LinkedIn Organization ID:**
- Double-click the "Post to LinkedIn" node
- In the JSON body, find `YOUR_LINKEDIN_ORG_ID` and replace it with your actual org ID from Step 8
- So it reads like: `urn:li:organization:12345678`

**Update the Event Subscription URL:**
- When you open the Slack Reaction Trigger node in this workflow, it will show a new webhook URL
- Go back to https://api.slack.com/apps > your app > Event Subscriptions
- Update the Request URL with this new webhook URL
- Wait for it to verify

**Test it:**
- Activate this workflow (toggle Active ON) — the Slack Trigger only works when the workflow is active, unlike other triggers
- Go to your Slack approval channel
- Find a draft post from Phase 1 (or run Workflow 1 manually to generate one)
- React to the draft message with the :white_check_mark: emoji (checkmark)
- Go back to n8n and check the execution log — you should see the workflow fire
- Check LinkedIn and X to confirm the posts appeared
- A threaded reply should appear in Slack saying "Posted!"

**If the reaction doesn't trigger anything:**
- Make sure Workflow 2 is toggled Active
- Make sure Event Subscriptions are enabled in your Slack app with the correct webhook URL
- Make sure `reaction_added` is in the bot events list
- Make sure the bot is in the approval channel

**If LinkedIn posting fails with 403:**
- Your token may not have the right scopes — regenerate it with `w_member_social` selected
- If posting as a company page, you need `w_organization_social` which requires separate approval from LinkedIn

**If X posting fails:**
- Make sure OAuth2 is connected (green checkmark on the credential)
- Check that your X app has "Read and write" permissions
- X free tier has rate limits — 17 tweets per 24 hours

---

## YOU'RE DONE

Both workflows are active. Here's what happens every day:

1. **9am, 1pm, 5pm** — Workflow 1 scans your Slack channels
2. **Claude reads the messages** and picks out interesting topics (wins, strategies, questions, case studies)
3. **Claude writes a LinkedIn post and X post** for each topic
4. **A formatted draft appears in your Slack approval channel** with the full text of both posts
5. **You read the draft and react with :white_check_mark:** to approve it
6. **Workflow 2 detects your reaction**, extracts the post content, and publishes to LinkedIn and X
7. **A confirmation reply appears** in the Slack thread

To reject a post: react with :x: (it gets ignored, nothing happens).
To edit before posting: for now, copy the draft, edit it manually, and post yourself. (An edit flow can be added later.)

---

## AFTER SETUP: Tuning Your Agents

The two most impactful things to customize are in the CONFIG node of Workflow 1:

**scanner_prompt** — Controls what Claude looks for. You can:
- Add specific topics to watch for ("Look especially for Google Ads Performance Max results")
- Remove categories you don't care about
- Adjust the quality bar ("Only flag content that has specific numbers or results")
- Add keywords to watch for

**creator_prompt** — Controls how Claude writes. You can:
- Adjust the brand voice description
- Add example posts that match your style
- Change post length preferences
- Add phrases to avoid or phrases to use
- Adjust hashtag strategy

Both prompts are plain English — just edit them like you're giving instructions to a new team member.

---

## MAINTENANCE

| Task | Frequency | How |
|---|---|---|
| Refresh LinkedIn token | Every 60 days | Go to LinkedIn OAuth tools, generate new token, update the n8n credential |
| Check X connection | Monthly | Open the X credential in n8n, verify it still shows connected |
| Review scan quality | Weekly | Look at what Workflow 1 sends to Slack — if it's too noisy, tighten the scanner_prompt. If it's missing things, loosen it. |
| Add/remove channels | As needed | Edit the CONFIG node channel array in Workflow 1 |
