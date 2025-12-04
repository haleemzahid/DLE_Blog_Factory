# DocumentVoiceButton Component

## What it does

Adds voice input to **rich text editors** (Lexical editor) for longer content like post bodies.

## Location

`src/components/DocumentVoiceButton/index.tsx`

## Features

- **Voice Recording** - Dictate content directly into editor
- **Multi-language** - Same 20+ language support
- **Text-to-Speech** - Read content aloud
- **Undo/Redo** - Quick editing controls
- **Auto-insertion** - Text flows directly into editor

## How it works

1. Open a document with rich text content
2. Click the voice button near the editor
3. Select language from dropdown
4. Speak - text inserts at cursor position

## Button Functions

| Button | Action |
|--------|--------|
| 🎤 | Start/stop voice recording |
| 🔊 | Read content aloud |
| ↩️ | Undo last change |
| ↪️ | Redo last change |
| 🌐 | Change language |

## Integration

Registered as a global provider in `payload.config.ts` to appear on all document editors.
