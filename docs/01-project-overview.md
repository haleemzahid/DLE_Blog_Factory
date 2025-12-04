# Project Overview

## What is this?

A modern website CMS built with **PayloadCMS** and **Next.js** featuring multi-language voice support.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Frontend framework |
| PayloadCMS 3.63 | Headless CMS backend |
| Vercel Postgres | Database |
| Vercel Blob | File storage |
| Lexical Editor | Rich text editing |
| Tailwind CSS | Styling |

## Key Features

- Voice-to-text input in 20+ languages
- AI-powered content composition
- SEO optimization built-in
- Draft/publish workflow
- Full-text search
- Responsive media handling

## Project Structure

```
src/
├── app/           # Next.js pages and routes
├── collections/   # Database schemas (Posts, Pages, Media, etc.)
├── components/    # Reusable UI components
├── blocks/        # Content building blocks
├── fields/        # Custom field types
├── plugins/       # CMS plugins
├── hooks/         # Data hooks
└── utilities/     # Helper functions
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000/admin` to access the admin panel.
