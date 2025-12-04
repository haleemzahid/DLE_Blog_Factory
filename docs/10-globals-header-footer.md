# Header & Footer Globals

## What they do

Site-wide navigation that appears on every page.

## Locations

- Header: `src/Header/config.ts`
- Footer: `src/Footer/config.ts`

## Structure

Both share the same structure:

```
navItems (array)
└── link
    ├── type (internal/custom)
    ├── reference (page/post)
    ├── url (custom URL)
    ├── label (link text)
    ├── newTab (open in new window)
    └── appearance (default/outline)
```

## Features

| Feature | Description |
|---------|-------------|
| Internal Links | Link to pages/posts |
| External Links | Custom URLs |
| New Tab | Open links externally |
| Max Items | Up to 6 nav items |
| Auto Revalidate | Updates cache on change |

## Access

- **Read**: Anyone (public)
- **Update**: Authenticated users

## How to Edit

1. Go to Admin Panel
2. Click "Globals" in sidebar
3. Select "Header" or "Footer"
4. Add/edit navigation items
5. Save changes

Changes reflect immediately on the live site.
