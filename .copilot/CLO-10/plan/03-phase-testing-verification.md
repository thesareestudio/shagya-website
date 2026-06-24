# Phase 3: Testing & Verification

**Milestone:** All tests pass — Unit tests validate every access control rule in the matrix.

---

## Overview

The access control matrix must be verified with unit tests. Each cell in the matrix (operation × role) gets a test case. We write tests BEFORE implementation to drive the correct behavior (TDD).

### What we'll build

```
src/collections/__tests__/
└── Users.test.ts (new)
    ├── Role schema tests
    │   ├── has all four role options
    │   ├── default role is editor
    │   └── super-admin role value is 'super-admin'
    └── Access control tests
        ├── super-admin: unrestricted all operations
        ├── admin: can create non-super-admin
        ├── admin: cannot create super-admin
        ├── admin: can read all
        ├── admin: can update non-super-admin
        ├── admin: cannot update super-admin
        ├── admin: can delete non-super-admin
        ├── admin: cannot delete super-admin
        ├── editor: can read own profile
        ├── editor: cannot create users
        ├── editor: cannot read all
        ├── content-manager: can update own profile
        └── unauthenticated: rejected all operations
```

### Key decisions

| Decision               | Choice                                    | Rationale                                     |
| ---------------------- | ----------------------------------------- | --------------------------------------------- |
| Test framework         | Vitest                                    | Already configured in the project (make test) |
| Access control testing | Direct function call with mock `req`      | Isolate unit under test, fast feedback        |
| Test file location     | `src/collections/__tests__/Users.test.ts` | Co-located with the collection                |

---

## Checklist

> Track your progress in [`_checklist.md`](./_checklist.md#phase-3-testing--verification).

---

## Key Files

| File                                      | Purpose                         |
| ----------------------------------------- | ------------------------------- |
| `src/collections/__tests__/Users.test.ts` | Unit tests for Users collection |
| `src/collections/Users.ts`                | Collection under test           |

---

## Reference

- [Vitest Documentation](https://vitest.dev/)
- [Payload Access Control Testing Patterns](https://payloadcms.com/docs/access-control/overview#testing-access-control)

---

## Definition of Done

- [ ] All role schema tests pass (4 options, default value, super-admin value)
- [ ] All access control matrix tests pass (at least 14 test cases)
- [ ] `make test` passes with all tests green
- [ ] `make typecheck` passes
- [ ] `make lint` passes
- [ ] Full project test suite passes (`make test`)

---

**Navigation:** [← Phase 2: Access Control Updates](./02-phase-access-control-updates.md) — ↑ [Overview](./README.md)
