# CLO-10: Create Users collection (Payload admin auth)

## Overview

Users collection for admin/staff auth via Payload. Roles: super-admin, admin, editor, content-manager. Email+password login. Admin UI access control by role.

## Acceptance Criteria

- [ ] Users collection with email+password auth via Payload's built-in auth
- [ ] Role field with options: super-admin, admin, editor, content-manager
- [ ] Access control restricts create/update/delete based on role
- [ ] Super-admin has unrestricted access (can create, read, update, delete all)
- [ ] Admin can create users and manage non-super-admin users
- [ ] Editor and content-manager can read/update their own profile only
- [ ] Only super-admin can assign/change the super-admin role
- [ ] Token expiration configured (2 hours)
- [ ] Login attempt lockout (5 attempts, 10 min lock)
- [ ] Unit tests covering access control rules

## Technical Notes

- Existing file: `src/collections/Users.ts` — has basic auth with admin/editor/content-manager roles
- Need to add `super-admin` to the role options
- Access control functions need updating to handle super-admin tier
- Payload's built-in auth handles password hashing, JWT, and session management
- Config reference: `src/payload.config.ts` (admin.user = 'users')
