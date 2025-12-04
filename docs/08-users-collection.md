# Users Collection

## What it does

Manages admin users who can create and edit content.

## Location

`src/collections/Users/index.ts`

## Fields

| Field | Type | Description |
|-------|------|-------------|
| email | email | Login email (built-in) |
| password | password | Login password (built-in) |
| name | text | Display name (voice enabled) |
| createdAt | date | Account creation date |
| updatedAt | date | Last update date |

## Features

- **Authentication** - Built-in JWT auth
- **Admin Access** - Controls panel access
- **Voice Input** - Name field supports speech
- **Timestamps** - Auto-tracked dates

## Access Control

- Only authenticated users can view/edit users
- Self-registration not enabled by default

## Author Attribution

Users can be assigned as post authors:
- Shows author name on posts
- Links to author profile
- Multiple authors supported
