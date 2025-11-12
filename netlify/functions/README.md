# Netlify Functions

This directory contains Netlify serverless functions for the ragTech website.

## get-pledge-count

This function retrieves the number of form submissions for the Techie Taboo waitlist from the Netlify Forms API.

### Purpose
- Displays a real-time count of supporters who have joined the Techie Taboo waitlist
- Updates automatically without page refresh (polls every 30 seconds)

### How It Works
1. Receives a GET request from the frontend
2. Uses Netlify API token to authenticate with Netlify's API
3. Fetches all form submissions for the site
4. Filters for submissions with form name `techie-taboo-waitlist`
5. Returns the count as JSON

### Required Environment Variables

Set these in **Netlify Dashboard → Site Settings → Environment Variables**:

- `SITE_ID`: Your Netlify site ID
  - Find it in: Site settings > General > Site details > API ID

- `NETLIFY_API_TOKEN`: Your personal access token
  - Create one at: User settings > Applications > Personal access tokens > New access token
  - Requires `forms:read` scope at minimum

### Endpoint

```
GET /.netlify/functions/get-pledge-count
```

### Response Format

```json
{
  "count": 42,
  "message": "Success"
}
```

### Error Handling

The function gracefully handles errors and returns a count of 0 if:
- Environment variables are missing
- Netlify API is unreachable
- Authentication fails
- No submissions exist yet

This ensures the page loads without breaking even if the function isn't configured yet.

### Security

- Uses CORS headers to allow frontend access
- API token is stored securely as an environment variable
- Never exposed to the client
- Read-only access to form submissions

### Testing Locally

To test the function locally with Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local dev server with functions
netlify dev
```

This will start the Next.js dev server and the Netlify functions on `http://localhost:8888`.
