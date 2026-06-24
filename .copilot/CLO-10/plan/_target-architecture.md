# Target Architecture

## Role Hierarchy

```
super-admin (unrestricted — all operations on all users)
└── admin (manage non-super-admin users, assign non-super-admin roles)
    ├── editor (self-read, self-update)
    └── content-manager (self-read, self-update)
```

## Users Collection — Target State

```
Users (collection)
├── slug: 'users'
├── auth: email+password (unchanged)
├── admin: useAsTitle='email', group='Admin'
├── timestamps: true
├── fields:
│   ├── name: text (required)
│   └── role: select (required, default='editor')
│       ├── super-admin
│       ├── admin
│       ├── editor
│       └── content-manager
│       access.update: super-admin only
└── access:
    ├── create: super-admin = all, admin = non-super-admin
    ├── read: super-admin = all, admin = all, self = own only
    ├── update: super-admin = all, admin = non-super-admin, self = own profile
    ├── delete: super-admin = all, admin = non-super-admin
```

## Access Control Matrix

| Operation               | super-admin |        admin         | editor | content-manager |
| ----------------------- | :---------: | :------------------: | :----: | :-------------: |
| Create any user         |     ✅      | ✅ (non-super-admin) |   ❌   |       ❌        |
| Read all users          |     ✅      |          ✅          |   ❌   |       ❌        |
| Read own profile        |     ✅      |          ✅          |   ✅   |       ✅        |
| Update any user         |     ✅      | ✅ (non-super-admin) |   ❌   |       ❌        |
| Update own profile      |     ✅      |          ✅          |   ✅   |       ✅        |
| Delete any user         |     ✅      | ✅ (non-super-admin) |   ❌   |       ❌        |
| Assign super-admin role |     ✅      |          ❌          |   ❌   |       ❌        |

## Data Flow

```
1. User logs in via /api/users/login
2. Payload validates credentials, returns JWT + user object (with role)
3. Admin UI checks access control functions on each operation
4. Field-level access on role: only super-admin can change roles
5. Collection-level access enforces create/read/update/delete matrix
```

[↑ Overview](./README.md)
