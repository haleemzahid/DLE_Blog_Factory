# Access Control

## What it does

Controls who can read, create, update, and delete content.

## Location

`src/access/`

## Access Levels

### anyone
`src/access/anyone.ts`

```typescript
// Returns true - everyone can access
```

Used for: Public content reading

### authenticated
`src/access/authenticated.ts`

```typescript
// Checks if user is logged in
return Boolean(req.user)
```

Used for: Creating/editing content

### authenticatedOrPublished
`src/access/authenticatedOrPublished.ts`

```typescript
// Logged in: see all
// Anonymous: see published only
```

Used for: Reading posts/pages

## Applied To Collections

| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| Posts | auth | authOrPub | auth | auth |
| Pages | auth | authOrPub | auth | auth |
| Media | auth | anyone | auth | auth |
| Categories | - | anyone | - | - |
| Users | auth | auth | auth | auth |

## How it Works

1. User makes request
2. Access function runs
3. Returns `true` (allow) or `false` (deny)
4. Or returns query filter (partial access)
