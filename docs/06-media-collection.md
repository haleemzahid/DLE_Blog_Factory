# Media Collection

## What it does

Manages all images, videos, and files uploaded to the site.

## Location

`src/collections/Media.ts`

## Fields

| Field | Type | Description |
|-------|------|-------------|
| alt | text | Alternative text for accessibility |
| caption | richText | Optional caption |

## Image Sizes

Automatically generates responsive sizes:

| Size | Dimensions | Use Case |
|------|------------|----------|
| thumbnail | 300px | Previews |
| square | 500x500 | Avatars |
| small | 600px | Mobile |
| medium | 900px | Tablet |
| large | 1400px | Desktop |
| xlarge | 1920px | Full-width |
| og | 1200x630 | Social sharing |

## Features

- **Folder Organization** - Hierarchical structure
- **Focal Point** - Smart image cropping
- **AI Captions** - Auto-generate descriptions
- **Blob Storage** - Vercel cloud hosting

## Storage Location

Files saved to `/public/media` and Vercel Blob
