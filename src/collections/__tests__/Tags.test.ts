import { describe, it, expect } from 'vitest'
import { Tags } from '../Tags'

describe('Tags collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(Tags.slug).toBe('tags')
    })

    it('uses name as display title', () => {
      expect(Tags.admin?.useAsTitle).toBe('name')
    })

    it('is in Taxonomy admin group', () => {
      expect(Tags.admin?.group).toBe('Taxonomy')
    })

    it('has timestamps enabled', () => {
      expect(Tags.timestamps).toBe(true)
    })
  })

  describe('Access control', () => {
    it('allows public read', () => {
      const result = Tags.access?.read?.({ req: {} } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated create', () => {
      const result = Tags.access?.create?.({ req: { user: undefined } } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated create', () => {
      const result = Tags.access?.create?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated update', () => {
      const result = Tags.access?.update?.({ req: { user: undefined } } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated update', () => {
      const result = Tags.access?.update?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })

    it('blocks unauthenticated delete', () => {
      const result = Tags.access?.delete?.({ req: { user: undefined } } as any)
      expect(result).toBe(false)
    })

    it('allows authenticated delete', () => {
      const result = Tags.access?.delete?.({
        req: { user: { id: '1' } },
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('Fields', () => {
    it('has name field (text, required)', () => {
      const field = Tags.fields?.find((f: any) => f.name === 'name') as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.required).toBe(true)
    })

    it('has slug field (text, unique, indexed, readOnly)', () => {
      const field = Tags.fields?.find((f: any) => f.name === 'slug') as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.unique).toBe(true)
      expect(field?.index).toBe(true)
      expect(field?.admin?.readOnly).toBe(true)
    })

    it('has description field (textarea)', () => {
      const field = Tags.fields?.find(
        (f: any) => f.name === 'description',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('textarea')
    })

    it('has exactly 3 fields', () => {
      expect(Tags.fields).toHaveLength(3)
    })
  })

  describe('Slug generation hook', () => {
    it('generates lowercase slug from name', () => {
      const hook = Tags.hooks?.beforeChange?.[0]
      expect(hook).toBeDefined()
      if (!hook) return

      const result = hook({
        data: { name: 'Silk Sarees' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('silk-sarees')
    })

    it('replaces spaces with dashes and trims', () => {
      const hook = Tags.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: '  Handloom  Cotton  ' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('handloom-cotton')
    })

    it('removes special characters', () => {
      const hook = Tags.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: "Men's & Women's Wear!" },
        operation: 'create',
      } as any)

      expect(result.slug).not.toContain("'")
      expect(result.slug).not.toContain('&')
      expect(result.slug).not.toContain('!')
    })

    it('handles Devanagari text gracefully', () => {
      const hook = Tags.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { name: 'रेसमी साड़ी' },
        operation: 'create',
      } as any)

      expect(result.slug).toBeDefined()
    })
  })
})
