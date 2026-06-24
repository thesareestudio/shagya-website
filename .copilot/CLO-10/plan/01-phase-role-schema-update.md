# Phase 1: Role Schema Update

**Milestone:** super-admin role added — The Users collection supports all four roles with super-admin at the top.

---

## Overview

The existing role field has three options: admin, editor, content-manager. We need to add `super-admin` as the top-tier role. This phase updates the field definition, default values, and ensures the schema is consistent.

### What we'll build

```
src/collections/Users.ts (modified)
├── role.options: add { label: 'Super Admin', value: 'super-admin' }
├── role.defaultValue: retain 'editor'
└── role.access.update: super-admin only
```

### Key decisions

| Decision          | Choice                    | Rationale                                                            |
| ----------------- | ------------------------- | -------------------------------------------------------------------- |
| super-admin value | `'super-admin'`           | Consistent kebab-case pattern with existing `content-manager`        |
| Default role      | `editor` (unchanged)      | Lowest privilege by default; super-admin must be explicitly assigned |
| Role ordering     | super-admin first in list | Visual hierarchy in admin dropdown                                   |

---

## Checklist

> Track your progress in [`_checklist.md`](./_checklist.md#phase-1-role-schema-update).

---

## Key Files

| File                       | Purpose                         |
| -------------------------- | ------------------------------- |
| `src/collections/Users.ts` | Add super-admin to role options |

---

## Reference

- [Payload Fields — select](https://payloadcms.com/docs/fields/select)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)

---

## Definition of Done

- [ ] `super-admin` added to role select options
- [ ] Role field access updated so only super-admin can assign super-admin role
- [ ] Role options ordered: super-admin, admin, editor, content-manager
- [ ] `make typecheck` passes
- [ ] `make lint` passes

---

**Navigation:** ↑ [Overview](./README.md) — **Next →** [Phase 2: Access Control Updates](./02-phase-access-control-updates.md)
