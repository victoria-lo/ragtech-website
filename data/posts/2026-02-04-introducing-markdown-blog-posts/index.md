---
title: "Introducing Markdown-Based Blog Posts"
slug: "introducing-markdown-blog-posts"
author:
  name: "ragTech Team"
  email: "hello@ragtechdev.com"
  profilePicture: "/assets/authors/ragtech-team.png"
publishedAt: "2026-02-04T12:00:00Z"
coverImage: "/assets/laptop.png"
brief: "We're excited to announce a new way to write and publish blog posts using Markdown, giving us full control over our content while maintaining our newsletter capabilities."
tags: ["announcement", "tech", "blogging"]
readTimeInMinutes: 5
status: "published"
newsletter:
  send: false
  sent: false
seo:
  metaDescription: "Learn about ragTech's new markdown-based blog system"
  keywords: ["markdown", "blogging", "content management"]
---

# Introducing Markdown-Based Blog Posts

We're excited to announce a major upgrade to how we manage and publish content on ragTech. Starting today, all our blog posts are written in **Markdown** and stored directly in our codebase, giving us unprecedented control over our content.

## Why Markdown?

After using various blogging platforms, we realized we needed something that offers:

- **Full version control** - Every change is tracked in Git
- **Better editing experience** - Write in your favorite editor (VS Code, anyone?)
- **Portability** - Our content isn't locked into any platform
- **AI-friendly** - Easy for AI coding assistants to help create and edit content
- **Flexibility** - Complete control over formatting and layout

## How It Works

Each blog post lives in its own folder with this structure:

```
data/posts/
  2026-02-04-post-slug/
    index.md          # Main content
    images/           # Post images
      cover.jpg
      screenshot.png
```

### Frontmatter

Every post starts with YAML frontmatter containing metadata:

```yaml
---
title: "Your Post Title"
slug: "url-friendly-slug"
author:
  name: "Author Name"
  profilePicture: "/path/to/photo.jpg"
publishedAt: "2026-02-04T12:00:00Z"
coverImage: "./images/cover.jpg"
brief: "Short description"
tags: ["tag1", "tag2"]
status: "published"
---
```

## Markdown Features

Our markdown parser supports:

### Rich Text Formatting

You can use **bold**, *italic*, ~~strikethrough~~, and `inline code`.

### Code Blocks

```typescript
interface BlogPost {
  title: string;
  content: string;
  publishedAt: Date;
}

const post: BlogPost = {
  title: "My Post",
  content: "Content here",
  publishedAt: new Date()
};
```

### Lists

**Unordered lists:**
- First item
- Second item
- Third item

**Ordered lists:**
1. Step one
2. Step two
3. Step three

### Links and Images

Check out our [website](https://ragtechdev.com) for more information.

Images are stored alongside the post:

![Sample image](./images/cover.jpg)

### Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

## Integration with Existing Content

This new system works seamlessly with our existing content:

- **Beehiiv posts** - Still accessible via API
- **Archived Hashnode posts** - Preserved in JSON format
- **New markdown posts** - Written and managed in our codebase

All three sources are unified into a single blog feed, sorted by date.

## Newsletter Capabilities

We're maintaining our email newsletter functionality through Resend, which means:

- Write posts in Markdown
- Publish to the blog automatically
- Send as email newsletters when ready
- Full control over email templates

## What's Next?

We're working on:

- Custom markdown directives for rich media embeds
- Podcast episode templates
- Automated publishing workflows
- Enhanced email templates

## Try It Yourself

Want to see the source? Check out our [GitHub repository](https://github.com/ragtechdev/ragtech-website) to see how this post is structured.

---

**Have questions or feedback?** Reach out to us on [Twitter](https://twitter.com/ragtechdev) or [LinkedIn](https://linkedin.com/company/ragtech).
