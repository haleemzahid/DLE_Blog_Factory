# Hooks System

## What they do

Run custom code when data changes (before/after create, update, delete).

## Types of Hooks

### Populate Authors
`src/collections/Posts/hooks/populateAuthors.ts`

Copies user data to posts for easy frontend access.

```
authors [user IDs] → populatedAuthors [name, email]
```

### Populate Published At
`src/hooks/populatePublishedAt.ts`

Auto-sets publish date when creating content.

```
if (!publishedAt) {
  publishedAt = new Date()
}
```

### Revalidate Hooks

Clears Next.js cache when content changes.

| Hook | Location |
|------|----------|
| revalidatePost | `src/collections/Posts/hooks/` |
| revalidatePage | `src/collections/Pages/hooks/` |
| revalidateHeader | `src/Header/hooks/` |
| revalidateFooter | `src/Footer/hooks/` |

## How They Work

```
User saves post
    ↓
afterChange hook runs
    ↓
revalidatePath('/posts/[slug]')
    ↓
Next.js clears cache
    ↓
Fresh content served
```

## Hook Timing

- `beforeChange` - Before saving to database
- `afterChange` - After saving to database
- `beforeRead` - Before returning data
- `afterRead` - After returning data
