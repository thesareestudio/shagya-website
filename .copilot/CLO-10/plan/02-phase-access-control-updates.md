# Phase 2: Access Control Updates

**Milestone:** Tiered RBAC in place — All access control functions respect the super-admin > admin > editor/content-manager hierarchy.

---

## Overview

With the super-admin role added, access control functions must be updated. Super-admin gets unrestricted access to all operations. Admin retains management of non-super-admin users but cannot touch super-admin accounts. Editor and content-manager remain self-service only.

### What we'll build

```
src/collections/Users.ts (modified)
├── access.create: super-admin = all, admin = only non-super-admin roles
├── access.read: super-admin/admin = all, self = own only
├── access.update: super-admin = all, admin = non-super-admin, self = own profile
└── access.delete: super-admin = all, admin = non-super-admin
```

### Key decisions

| Decision                         | Choice                                 | Rationale                                                     |
| -------------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| Admin can read all users         | Yes                                    | Admin needs to see full user list to manage the team          |
| Admin can delete non-super-admin | Yes                                    | Admin should manage their team; super-admin handles top-level |
| Self-update for editor/CM        | Profile fields only (name)             | Role change still blocked by field-level access               |
| Helper function                  | `isSuperAdmin(user)` + `isAdmin(user)` | Clean, reusable access checks                                 |

---

## Checklist

> Track your progress in [`_checklist.md`](./_checklist.md#phase-2-access-control-updates).

---

## Key Files

| File                       | Purpose                             |
| -------------------------- | ----------------------------------- |
| `src/collections/Users.ts` | Update all access control functions |

---

## Reference

- [Payload Access Control — Collection-level](https://payloadcms.com/docs/access-control/collections)
- [Payload Access Control — Field-level](https://payloadcms.com/docs/access-control/fields)

---

## Definition of Done

- [ ] `create` access allows super-admin all, admin non-super-admin roles only
- [ ] `read` access allows super-admin and admin to read all, self to read own
- [ ] `update` access allows super-admin all, admin non-super-admin, self own profile
- [ ] `delete` access allows super-admin all, admin non-super-admin only
- [ ] Field-level access on `role`: only super-admin can assign super-admin role
- [ ] `make typecheck` passes
- [ ] `make lint` passes

---

**Navigation:** [← Phase 1: Role Schema Update](./01-phase-role-schema-update.md) — ↑ [Overview](./README.md) — **Next →** [Phase 3: Testing & Verification](./03-phase-testing-verification.md)
