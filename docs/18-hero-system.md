# Hero System

## What it does

Configurable hero sections for page headers.

## Location

- Config: `src/heros/config.ts`
- Components: `src/heros/`

## Hero Types

### None
No hero section displayed.

### High Impact
Full-width hero with:
- Background image/video
- Overlay text
- CTA buttons
- Maximum visual impact

### Medium Impact
Balanced hero with:
- Side-by-side layout
- Media on one side
- Text on other side

### Low Impact
Simple text hero:
- Just headline and text
- No media required
- Clean and minimal

## Configuration

```typescript
{
  type: 'highImpact',
  richText: { /* content */ },
  linkGroup: [ /* buttons */ ],
  media: mediaId // required for high/medium
}
```

## Components

| File | Purpose |
|------|---------|
| HighImpact/index.tsx | Full-width hero |
| MediumImpact/index.tsx | Balanced layout |
| LowImpact/index.tsx | Text-only hero |
| PostHero/index.tsx | Blog post headers |

## Rendering

```tsx
import { RenderHero } from '@/heros/RenderHero'

<RenderHero {...page.hero} />
```
