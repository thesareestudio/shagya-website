import { describe, it, expect } from 'vitest'
import { Users } from '../Users'
import type { User } from '@/payload-types'

describe('Users collection', () => {
  describe('Role field', () => {
    it('has all four role options including super-admin', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role')

      if (!roleField || roleField.type !== 'select') {
        throw new Error('Role field not found or not a select field')
      }

      const optionValues = roleField.options.map((o: any) => o.value)

      expect(optionValues).toHaveLength(4)
      expect(optionValues).toContain('super-admin')
      expect(optionValues).toContain('admin')
      expect(optionValues).toContain('editor')
      expect(optionValues).toContain('content-manager')
    })

    it('has super-admin first in the role options order', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      expect(roleField.options[0].value).toBe('super-admin')
      expect(roleField.options[0].label).toBe('Super Admin')
    })

    it('has default role set to editor', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      expect(roleField.defaultValue).toBe('editor')
    })
  })

  describe('Field-level access on role', () => {
    const makeReq = (role: string | null) => ({
      user: role ? ({ id: '1', role } as unknown as User) : null,
    })

    it('allows super-admin to update role field', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      const result = roleField.access?.update?.({ req: makeReq('super-admin') })
      expect(result).toBe(true)
    })

    it('denies admin from updating role field', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      const result = roleField.access?.update?.({ req: makeReq('admin') })
      expect(result).toBe(false)
    })

    it('denies editor from updating role field', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      const result = roleField.access?.update?.({ req: makeReq('editor') })
      expect(result).toBe(false)
    })

    it('denies content-manager from updating role field', () => {
      const roleField = Users.fields?.find((f: any) => f.name === 'role') as any
      const result = roleField.access?.update?.({
        req: makeReq('content-manager'),
      })
      expect(result).toBe(false)
    })
  })
})
