import { describe, it, expect } from 'vitest'
import { FabricTypes } from '../FabricTypes'

describe('FabricTypes collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(FabricTypes.slug).toBe('fabric-types')
    })

    it('uses name as display title', () => {
      expect(FabricTypes.admin?.useAsTitle).toBe('name')
    })

    it('is in Taxonomy admin group', () => {
      expect(FabricTypes.admin?.group).toBe('Taxonomy')
    })

    it('has timestamps enabled', () => {
      expect(FabricTypes.timestamps).toBe(true)
    })
  })

  describe('Access control', () => {
    it('allows public read', () => {
      const result = FabricTypes.access?.read?.({ req: {} } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated create', () => {
      const result = FabricTypes.access?.create?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated create', () => {
      const result = FabricTypes.access?.create?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated update', () => {
      const result = FabricTypes.access?.update?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated update', () => {
      const result = FabricTypes.access?.update?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated delete', () => {
      const result = FabricTypes.access?.delete?.({
        req: { user: undefined },
      } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated delete', () => {
      const result = FabricTypes.access?.delete?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('Fields', () => {
    it('has name field (text, required)', () => {
      const field = FabricTypes.fields?.find(
        (f: any) => f.name === 'name',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.required).toBe(true)
    })

    it('has slug field (text, unique, indexed, readOnly)', () => {
      const field = FabricTypes.fields?.find(
        (f: any) => f.name === 'slug',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.unique).toBe(true)
      expect(field?.index).toBe(true)
      expect(field?.admin?.readOnly).toBe(true)
    })

    it('has description field (textarea)', () => {
      const field = FabricTypes.fields?.find(
        (f: any) => f.name === 'description',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('textarea')
    })

    it('has exactly 3 fields', () => {
      expect(FabricTypes.fields).toHaveLength(3)
    })
  })

  describe('Slug generation hook', () => {
    it('generates lowercase slug from name', () => {
      const hook = FabricTypes.hooks?.beforeChange?.[0]
      expect(hook).toBeDefined()
      if (!hook) return

      const result = hook({
        data: { name: 'Khadi Cotton' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('khadi-cotton')
    })

    it('replaces spaces with dashes and trims', () => {
      const hook = FabricTypes.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: '  Raw  Silk  ' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('raw-silk')
    })

    it('removes special characters', () => {
      const hook = FabricTypes.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: '100% Pure Cotton!' },
        operation: 'create',
      } as any)

      expect(result.slug).not.toContain('%')
      expect(result.slug).not.toContain('!')
    })

    it('handles Devanagari text gracefully', () => {
      const hook = FabricTypes.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: 'रेसमी कपड़ा' },
        operation: 'create',
      } as any)

      expect(result.slug).toBeDefined()
    })
  })
})
