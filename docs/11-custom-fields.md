# Custom Fields

## What they do

Reusable field configurations used across collections.

## Location

`src/fields/`

## Link Field

`src/fields/link.ts`

Creates smart links to internal pages or external URLs.

| Option | Type | Description |
|--------|------|-------------|
| type | select | internal or custom |
| reference | relation | Page or Post |
| url | text | External URL |
| label | text | Link text |
| newTab | checkbox | Open in new window |
| appearance | select | default or outline |

## Link Group Field

`src/fields/linkGroup.ts`

Array of links for button groups (CTAs).

## Default Lexical

`src/fields/defaultLexical.ts`

Standard rich text editor configuration:

- Paragraph formatting
- Bold, italic, underline
- Internal links (pages/posts)
- External links with validation
- AI compose integration

## Usage Example

```typescript
import link from '@/fields/link'

// In collection config
fields: [
  link({
    appearances: ['default', 'outline'],
  }),
]
```
