import { describe, it, expect } from 'vitest'
import { Navigation } from '../Navigation'

describe('Navigation collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(Navigation.slug).toBe('navigation')
    })

    it('uses name as display title', () => {
      expect(Navigation.admin?.useAsTitle).toBe('name')
    })

    it('is in Content admin group', () => {
      expect(Navigation.admin?.group).toBe('Content')
    })

    it('has timestamps enabled', () => {
      expect(Navigation.timestamps).toBe(true)
    })

    it('has exactly 3 fields', () => {
      expect(Navigation.fields).toHaveLength(3)
    })
  })

  describe('Name field', () => {
    const nameField = Navigation.fields?.find(
      (f: any) => f.name === 'name',
    ) as any

    it('exists and is a text field', () => {
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
    })

    it('is required', () => {
      expect(nameField?.required).toBe(true)
    })
  })

  describe('Location field', () => {
    const locationField = Navigation.fields?.find(
      (f: any) => f.name === 'location',
    ) as any

    it('exists and is a select field', () => {
      expect(locationField).toBeDefined()
      expect(locationField?.type).toBe('select')
    })

    it('is required', () => {
      expect(locationField?.required).toBe(true)
    })

    it('defaults to header', () => {
      expect(locationField?.defaultValue).toBe('header')
    })

    it('has all 3 location options', () => {
      const values = locationField?.options?.map((o: any) => o.value)
      expect(values).toHaveLength(3)
      expect(values).toContain('header')
      expect(values).toContain('footer')
      expect(values).toContain('sidebar')
    })
  })

  describe('Items array', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any

    it('exists and is an array field', () => {
      expect(itemsField).toBeDefined()
      expect(itemsField?.type).toBe('array')
    })

    it('has 6 sub-fields', () => {
      expect(itemsField?.fields).toHaveLength(6)
    })
  })

  describe('Items → label sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const labelField = itemsField?.fields?.find(
      (f: any) => f.name === 'label',
    ) as any

    it('exists and is a text field', () => {
      expect(labelField).toBeDefined()
      expect(labelField?.type).toBe('text')
    })

    it('is required', () => {
      expect(labelField?.required).toBe(true)
    })
  })

  describe('Items → type sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const typeField = itemsField?.fields?.find(
      (f: any) => f.name === 'type',
    ) as any

    it('exists and is a select field', () => {
      expect(typeField).toBeDefined()
      expect(typeField?.type).toBe('select')
    })

    it('is required', () => {
      expect(typeField?.required).toBe(true)
    })

    it('defaults to custom_url', () => {
      expect(typeField?.defaultValue).toBe('custom_url')
    })

    it('has all 4 type options', () => {
      const values = typeField?.options?.map((o: any) => o.value)
      expect(values).toHaveLength(4)
      expect(values).toContain('page')
      expect(values).toContain('category')
      expect(values).toContain('custom_url')
      expect(values).toContain('external')
    })
  })

  describe('Items → page sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const pageField = itemsField?.fields?.find(
      (f: any) => f.name === 'page',
    ) as any

    it('exists and is a relationship field', () => {
      expect(pageField).toBeDefined()
      expect(pageField?.type).toBe('relationship')
    })

    it('relates to pages collection', () => {
      expect(pageField?.relationTo).toBe('pages')
    })
  })

  describe('Items → category sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const categoryField = itemsField?.fields?.find(
      (f: any) => f.name === 'category',
    ) as any

    it('exists and is a relationship field', () => {
      expect(categoryField).toBeDefined()
      expect(categoryField?.type).toBe('relationship')
    })

    it('relates to categories collection', () => {
      expect(categoryField?.relationTo).toBe('categories')
    })
  })

  describe('Items → url sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const urlField = itemsField?.fields?.find(
      (f: any) => f.name === 'url',
    ) as any

    it('exists and is a text field', () => {
      expect(urlField).toBeDefined()
      expect(urlField?.type).toBe('text')
    })
  })

  describe('Items → openInNewTab sub-field', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const openInNewTabField = itemsField?.fields?.find(
      (f: any) => f.name === 'openInNewTab',
    ) as any

    it('exists and is a checkbox field', () => {
      expect(openInNewTabField).toBeDefined()
      expect(openInNewTabField?.type).toBe('checkbox')
    })
  })

  describe('Admin conditions on items sub-fields', () => {
    const itemsField = Navigation.fields?.find(
      (f: any) => f.name === 'items',
    ) as any
    const pageField = itemsField?.fields?.find(
      (f: any) => f.name === 'page',
    ) as any
    const categoryField = itemsField?.fields?.find(
      (f: any) => f.name === 'category',
    ) as any
    const urlField = itemsField?.fields?.find(
      (f: any) => f.name === 'url',
    ) as any

    it('page field is shown only when type is page', () => {
      const condition = pageField?.admin?.condition
      expect(condition).toBeDefined()
      if (typeof condition === 'function') {
        expect(condition({ type: 'page' })).toBe(true)
        expect(condition({ type: 'category' })).toBe(false)
        expect(condition({ type: 'custom_url' })).toBe(false)
        expect(condition({ type: 'external' })).toBe(false)
        expect(condition({})).toBeFalsy()
      }
    })

    it('category field is shown only when type is category', () => {
      const condition = categoryField?.admin?.condition
      expect(condition).toBeDefined()
      if (typeof condition === 'function') {
        expect(condition({ type: 'category' })).toBe(true)
        expect(condition({ type: 'page' })).toBe(false)
        expect(condition({ type: 'custom_url' })).toBe(false)
        expect(condition({ type: 'external' })).toBe(false)
        expect(condition({})).toBeFalsy()
      }
    })

    it('url field is hidden only when type is page or category', () => {
      const condition = urlField?.admin?.condition
      expect(condition).toBeDefined()
      if (typeof condition === 'function') {
        expect(condition({ type: 'custom_url' })).toBe(true)
        expect(condition({ type: 'external' })).toBe(true)
        expect(condition({ type: 'page' })).toBe(false)
        expect(condition({ type: 'category' })).toBe(false)
        expect(condition({})).toBeTruthy()
      }
    })
  })
})
