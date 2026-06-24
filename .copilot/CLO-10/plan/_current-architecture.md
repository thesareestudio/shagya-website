# Current Architecture

## Users Collection (`src/collections/Users.ts`)

```
Users (collection)
├── slug: 'users'
├── auth: email+password (tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000)
├── admin: useAsTitle='email', group='Admin'
├── timestamps: true
├── fields:
│   ├── name: text (required)
│   └── role: select (required, default='editor')
│       ├── admin
│       ├── editor
│       └── content-manager
└── access:
    ├── create: admin only
    ├── read: admin = all, self = own only
    ├── update: admin = all, self = own only (role field: admin only)
    ├── delete: admin only
```

## Role Hierarchy

```
admin
├── editor
└── content-manager
```

**Issue:** No super-admin tier. Admin has all power. Field-level access only protects role changes to admin-only. No special privileges for super-admin.

[↑ Overview](./README.md)
