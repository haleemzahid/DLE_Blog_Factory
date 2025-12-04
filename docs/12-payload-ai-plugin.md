# Payload AI Plugin

## What it does

Adds AI-powered content generation to the CMS.

## Location

`src/plugins/index.ts`

## Features

| Feature | Description |
|---------|-------------|
| AI Compose | Generate content with AI |
| Smart Suggestions | Context-aware writing help |
| Image Generation | AI-created images |
| Lexical Integration | Works in rich text editors |

## Enabled Collections

- Pages
- Posts
- Media

## How to Use

1. Open any enabled collection
2. Click in a text field
3. Look for the AI compose button (✨)
4. Enter a prompt
5. AI generates content

## Integration Points

- **VoiceComposeField** - Combines voice + AI
- **Rich Text Editors** - AI button in toolbar
- **Media Captions** - Auto-generate alt text

## Configuration

```typescript
payloadAiPlugin({
  collections: {
    [Pages.slug]: true,
    [Posts.slug]: true,
    [Media.slug]: true,
  },
  uploadCollection: Media.slug,
  debugging: true,
})
```
