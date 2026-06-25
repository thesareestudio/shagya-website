import { describe, it, expect } from 'vitest'
import { Occasions } from '../Occasions'

describe('Occasions collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(Occasions.slug).toBe('occasions')
    })

    it('uses name as display title', () => {
      expect(Occasions.admin?.useAsTitle).toBe('name')
    })

    it('is in Taxonomy admin group', () => {
      expect(Occasions.admin?.group).toBe('Taxonomy')
    })

    it('has timestamps enabled', () => {
      expect(Occasions.timestamps).toBe(true)
    })
  })

  describe('Access control', () => {
    it('allows public read', () => {
      const result = Occasions.access?.read?.({ req: {} } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated create', () => {
      const result = Occasions.access?.create?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated create', () => {
      const result = Occasions.access?.create?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated update', () => {
      const result = Occasions.access?.update?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated update', () => {
      const result = Occasions.access?.update?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated delete', () => {
      const result = Occasions.access?.delete?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated delete', () => {
      const result = Occasions.access?.delete?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('Fields', () => {
    it('has name field (text, required)', () => {
      const field = Occasions.fields?.find((f: any) => f.name === 'name') as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.required).toBe(true)
    })

    it('has slug field (text, unique, indexed, readOnly)', () => {
      const field = Occasions.fields?.find((f: any) => f.name === 'slug') as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.unique).toBe(true)
      expect(field?.index).toBe(true)
      expect(field?.admin?.readOnly).toBe(true)
    })

    it('has description field (textarea)', () => {
      const field = Occasions.fields?.find(
        (f: any) => f.name === 'description',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('textarea')
    })

    it('has exactly 3 fields', () => {
      expect(Occasions.fields).toHaveLength(3)
    })
  })

  describe('Slug generation hook', () => {
    it('generates lowercase slug from name', () => {
      const hook = Occasions.hooks?.beforeChange?.[0]
      expect(hook).toBeDefined()
      if (!hook) return

      const result = hook({
        data: { name: 'Wedding Season' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('wedding-season')
    })

    it('replaces spaces with dashes and trims', () => {
      const hook = Occasions.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: '  Festive  Collection  ' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('festive-collection')
    })

    it('removes special characters', () => {
      const hook = Occasions.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: "Mother's Day & More!" },
        operation: 'create',
      } as any)

      expect(result.slug).not.toContain("'")
      expect(result.slug).not.toContain('&')
      expect(result.slug).not.toContain('!')
    })

    it('handles Devanagari text gracefully', () => {
      const hook = Occasions.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: 'त्योहार संग्रह' },
        operation: 'create',
      } as any)

      expect(result.slug).toBeDefined()
    })
  })
})
