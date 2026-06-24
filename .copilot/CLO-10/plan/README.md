# Users Collection Enhancement — Implementation Plan

Enhance the existing Users collection to support super-admin role and proper tiered access control for Payload admin auth.

---

## Context

| Document                      | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| [Feature Spec](../feature.md) | Original issue description and acceptance criteria |

---

## Architecture

| Diagram                                            | Description                                       |
| -------------------------------------------------- | ------------------------------------------------- |
| [Current Architecture](./_current-architecture.md) | What exists today                                 |
| [Target Architecture](./_target-architecture.md)   | Target state with role hierarchy and access rules |

---

## Phase Overview

Each phase builds on the previous one. Complete all checklist items before moving on.

| #   | Phase                                                          | Milestone              | Description                                                   |
| --- | -------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| 1   | [Role Schema Update](./01-phase-role-schema-update.md)         | super-admin role added | Add super-admin to role options, update default values        |
| 2   | [Access Control Updates](./02-phase-access-control-updates.md) | Tiered RBAC in place   | Update create/read/update/delete access for super-admin tier  |
| 3   | [Testing & Verification](./03-phase-testing-verification.md)   | All tests pass         | Unit tests for access control rules, integration verification |

---

## Quick Links

- [Feature Spec](../feature.md) — What we're building and why
- [Master Checklist](./_checklist.md)
- [Phase 1: Role Schema Update](./01-phase-role-schema-update.md) →
