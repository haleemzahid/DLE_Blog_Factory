# Frontend Components

## What they do

Reusable React components for rendering content on the website.

## Location

`src/components/`

## Key Components

### AdminBar
`src/components/AdminBar/index.tsx`

Floating toolbar for logged-in admins.
- Edit links to admin panel
- Preview mode indicator
- Only visible to authenticated users

### RichText
`src/components/RichText/index.tsx`

Converts Lexical editor content to HTML.
- Block rendering (Banner, Media, Code)
- Link handling (internal/external)
- Prose styling with Tailwind

### Media
`src/components/Media/index.tsx`

Smart image/video display.
- Auto-detects media type
- Responsive sizes
- Lazy loading

### Card
`src/components/Card/index.tsx`

Post preview card.
- Title and excerpt
- Category badge
- Featured image
- Clickable to full post

### BeforeDashboard
`src/components/BeforeDashboard/index.tsx`

Admin welcome screen.
- Getting started guide
- Seed database button
- Documentation links

## Usage

```tsx
import { RichText } from '@/components/RichText'
import { Media } from '@/components/Media'

<RichText data={post.content} />
<Media resource={post.heroImage} />
```
