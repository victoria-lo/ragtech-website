# Newsletter System - Usage Guide

Complete guide for using the Resend newsletter integration with your markdown blog posts.

---

## Quick Start

### 1. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@ragtechdev.com
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxx
```

**Get your credentials:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (ragtechdev.com)
3. Generate API key from Settings → API Keys
4. Create an Audience and copy the Audience ID

### 2. Test Email Templates Locally

Preview your email templates in the browser:

```bash
npm run email:dev
```

This opens a local server at `http://localhost:3000` where you can see and edit email templates in real-time.

### 3. Create a Post with Newsletter

Create a markdown post with newsletter enabled:

```yaml
---
title: "My Newsletter Post"
slug: "my-newsletter-post"
# ... other fields ...
newsletter:
  send: true      # Enable newsletter sending
  sent: false     # Will be updated automatically after sending
---

Your post content here...
```

### 4. Send Test Email

Before sending to your full audience, test the email:

```bash
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-newsletter-post", "testEmail": "you@example.com"}'
```

### 5. Send to Full Audience

Once you're happy with the test:

```bash
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-newsletter-post"}'
```

The post frontmatter will automatically update to `newsletter.sent: true`.

---

## Subscriber Management

### Dual Subscription (Resend + Beehiiv)

The subscribe API is configured to add subscribers to **both** Resend and Beehiiv simultaneously.

**Configuration:** `app/api/newsletter/subscribe/route.ts`

```typescript
const NEWSLETTER_CONFIG = {
  resend: true,   // Set to false to disable Resend
  beehiiv: true,  // Set to false to disable Beehiiv
};
```

### Disable Beehiiv (Keep Only Resend)

To remove Beehiiv and use only Resend:

1. Edit `app/api/newsletter/subscribe/route.ts`:
   ```typescript
   const NEWSLETTER_CONFIG = {
     resend: true,
     beehiiv: false,  // Disabled
   };
   ```

2. Remove Beehiiv from other parts of the codebase (optional cleanup):
   - `lib/posts.ts` - Set `beehiiv: false` in DEFAULT_CONFIG
   - Remove `BEEHIIV_API_KEY` from `.env.local`

### Subscribe Form

The existing newsletter form in `app/blog/NewsletterSection.tsx` automatically subscribes users to both services (based on configuration).

No changes needed to the frontend - it just calls `/api/newsletter/subscribe`.

---

## API Reference

### POST `/api/newsletter/send`

Send a blog post as a newsletter.

**Request Body:**
```json
{
  "slug": "post-slug",
  "testEmail": "optional@test.com"  // Optional: send to test email
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_xxxxx",
  "message": "Newsletter sent to audience"
}
```

**Errors:**
- `400` - Post not found, newsletter not enabled, or already sent
- `500` - Failed to send newsletter

---

### POST `/api/newsletter/send-pending`

Send all posts with `newsletter.send: true` and `newsletter.sent: false`.

**Request:** No body required

**Response:**
```json
{
  "message": "Sent 3 of 3 newsletters",
  "sent": 3,
  "total": 3,
  "results": [
    {
      "slug": "post-1",
      "title": "Post Title",
      "success": true,
      "messageId": "msg_xxxxx"
    }
  ]
}
```

---

### POST `/api/newsletter/subscribe`

Subscribe a user to newsletter services.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",      // Optional
  "lastName": "Doe"         // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to Resend and Beehiiv",
  "results": {
    "resend": { "success": true },
    "beehiiv": { "success": true }
  }
}
```

---

## Workflow Examples

### Example 1: Manual Newsletter Send

```bash
# 1. Create post with newsletter enabled
# data/posts/2026-02-05-my-post/index.md

# 2. Test send
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-post", "testEmail": "me@example.com"}'

# 3. Check your email

# 4. Send to audience
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-post"}'
```

### Example 2: Batch Send All Pending

```bash
# Send all posts with newsletter.send: true and newsletter.sent: false
curl -X POST http://localhost:3000/api/newsletter/send-pending
```

### Example 3: Scheduled Daily Send (GitHub Actions)

Create `.github/workflows/send-newsletters.yml`:

```yaml
name: Send Pending Newsletters
on:
  schedule:
    - cron: '0 10 * * *'  # Daily at 10 AM UTC
  workflow_dispatch:       # Manual trigger

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - name: Send Newsletters
        run: |
          curl -X POST https://ragtechdev.com/api/newsletter/send-pending \
            -H "Content-Type: application/json"
```

---

## Email Template Customization

### Modify Email Layout

Edit `emails/components/EmailLayout.tsx` to customize:
- Header/logo
- Footer text
- Colors and styling
- Unsubscribe link

### Modify Blog Post Template

Edit `emails/BlogPostNewsletter.tsx` to customize:
- Cover image display
- Content preview length
- CTA button text/style
- Tag display

### Preview Changes

```bash
npm run email:dev
```

Navigate to your template in the browser to see changes in real-time.

---

## Troubleshooting

### Newsletter Not Sending

**Check:**
1. `RESEND_API_KEY` is set in `.env.local`
2. `RESEND_AUDIENCE_ID` is set
3. Domain is verified in Resend dashboard
4. Post has `newsletter.send: true` in frontmatter
5. Post status is `published`

**View logs:**
```bash
# Check terminal where dev server is running
# Look for errors like "Resend is not configured"
```

### Subscribers Not Added

**Check:**
1. `RESEND_AUDIENCE_ID` is correct
2. Email address is valid
3. Check Resend dashboard → Audiences → Contacts
4. Check browser console for API errors

**Test manually:**
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Email Looks Broken

**Common issues:**
- Images not loading: Use absolute URLs (https://ragtechdev.com/...)
- Styles not applied: Email clients strip most CSS
- Layout broken: Test in multiple email clients

**Test in multiple clients:**
- Gmail (web and mobile)
- Outlook
- Apple Mail
- Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) for comprehensive testing

---

## Production Deployment

### 1. Add Environment Variables

Add to your production environment (Vercel/Netlify):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@ragtechdev.com
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxx
```

### 2. Verify Domain

In Resend dashboard:
1. Go to Settings → Domains
2. Add ragtechdev.com
3. Add DNS records (SPF, DKIM, DMARC)
4. Wait for verification

### 3. Test Production

```bash
# Test send
curl -X POST https://ragtechdev.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"slug": "test-post", "testEmail": "you@example.com"}'
```

### 4. Monitor Delivery

Check Resend dashboard for:
- Delivery rates
- Bounce rates
- Open rates (if tracking enabled)
- Spam complaints

---

## Best Practices

### 1. Always Test First

Never send to your full audience without testing:
```bash
# Always use testEmail first
{"slug": "post", "testEmail": "you@example.com"}
```

### 2. Respect Unsubscribes

The email template includes an unsubscribe link. Resend handles this automatically.

### 3. Monitor Engagement

Check Resend dashboard regularly for:
- Delivery issues
- High bounce rates
- Spam complaints

### 4. Content Guidelines

- Keep emails concise (500-1000 words)
- Use clear subject lines (post title)
- Include a clear CTA
- Optimize images (< 1MB)
- Test on mobile devices

### 5. Sending Frequency

Don't overwhelm subscribers:
- Max 1-2 newsletters per week
- Use batch send for multiple posts
- Consider a weekly digest format

---

## Decoupling Guide

### Remove Beehiiv Completely

1. **Disable in subscribe API:**
   ```typescript
   // app/api/newsletter/subscribe/route.ts
   const NEWSLETTER_CONFIG = {
     resend: true,
     beehiiv: false,
   };
   ```

2. **Disable in posts loader:**
   ```typescript
   // lib/posts.ts
   const DEFAULT_CONFIG = {
     markdown: true,
     beehiiv: false,
     archived: true,
   };
   ```

3. **Remove environment variables:**
   ```bash
   # Remove from .env.local
   # BEEHIIV_API_KEY
   # BEEHIIV_PUBLICATION_ID
   ```

4. **Optional cleanup:**
   - Remove `subscribeToBeehiiv` import from subscribe route
   - Remove Beehiiv-related code from `lib/beehiiv.ts`

### Remove Resend (Keep Beehiiv)

1. **Disable in subscribe API:**
   ```typescript
   const NEWSLETTER_CONFIG = {
     resend: false,
     beehiiv: true,
   };
   ```

2. **Remove environment variables:**
   ```bash
   # Remove from .env.local
   # RESEND_API_KEY
   # RESEND_FROM_EMAIL
   # RESEND_AUDIENCE_ID
   ```

---

## Cost Management

### Resend Pricing

- **Free tier:** 3,000 emails/month, 100 emails/day
- **Pro:** $20/month for 50,000 emails
- **Scale:** Custom pricing

### Optimization Tips

1. **Start with free tier** - Test and validate
2. **Monitor usage** - Check Resend dashboard
3. **Batch sends** - Use `/send-pending` instead of individual sends
4. **Clean your list** - Remove bounced/inactive subscribers
5. **Upgrade when needed** - Only when you consistently hit limits

---

## Support

### Resend Documentation
- [Resend Docs](https://resend.com/docs)
- [React Email Docs](https://react.email/docs)

### Troubleshooting
- Check server logs for errors
- Test API endpoints with curl
- Verify environment variables
- Check Resend dashboard for delivery issues

### Common Issues
- **"Resend is not configured"** - Set RESEND_API_KEY
- **"Audience not found"** - Check RESEND_AUDIENCE_ID
- **"Domain not verified"** - Complete domain verification in Resend
- **Emails going to spam** - Set up SPF/DKIM/DMARC records
