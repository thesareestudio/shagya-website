import { describe, it, expect } from 'vitest'
import { Forms } from '../Forms'

describe('Forms collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(Forms.slug).toBe('forms')
    })

    it('uses title as display title', () => {
      expect(Forms.admin?.useAsTitle).toBe('title')
    })

    it('is in Content admin group', () => {
      expect(Forms.admin?.group).toBe('Content')
    })

    it('has timestamps enabled', () => {
      expect(Forms.timestamps).toBe(true)
    })
  })

  describe('Fields', () => {
    it('has exactly 6 fields', () => {
      expect(Forms.fields).toHaveLength(6)
    })

    describe('title field', () => {
      const field = Forms.fields?.find((f: any) => f.name === 'title') as any

      it('exists and is a text field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('text')
      })

      it('is required', () => {
        expect(field?.required).toBe(true)
      })
    })

    describe('slug field', () => {
      const field = Forms.fields?.find((f: any) => f.name === 'slug') as any

      it('exists and is a text field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('text')
      })

      it('is unique and indexed', () => {
        expect(field?.unique).toBe(true)
        expect(field?.index).toBe(true)
      })

      it('is readOnly in admin', () => {
        expect(field?.admin?.readOnly).toBe(true)
      })
    })

    describe('emailTo field', () => {
      const field = Forms.fields?.find((f: any) => f.name === 'emailTo') as any

      it('exists and is an email field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('email')
      })

      it('has notification label and description', () => {
        expect(field?.label).toBe('Notification Email')
        expect(field?.admin?.description).toBeDefined()
      })
    })

    describe('submitButtonText field', () => {
      const field = Forms.fields?.find(
        (f: any) => f.name === 'submitButtonText',
      ) as any

      it('exists and is a text field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('text')
      })

      it('defaults to "Submit"', () => {
        expect(field?.defaultValue).toBe('Submit')
      })
    })

    describe('successMessage field', () => {
      const field = Forms.fields?.find(
        (f: any) => f.name === 'successMessage',
      ) as any

      it('exists and is a text field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('text')
      })

      it('defaults to a thank you message', () => {
        expect(field?.defaultValue).toBe('Thank you for your submission!')
      })
    })

    describe('fields array', () => {
      const field = Forms.fields?.find((f: any) => f.name === 'fields') as any

      it('exists and is an array field', () => {
        expect(field).toBeDefined()
        expect(field?.type).toBe('array')
      })

      it('has singular and plural labels', () => {
        expect(field?.labels?.singular).toBe('Form Field')
        expect(field?.labels?.plural).toBe('Form Fields')
      })

      it('has 5 sub-fields (label, name, type, required, options)', () => {
        expect(field?.fields).toHaveLength(5)
      })

      it('has label sub-field (text, required)', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'label',
        ) as any
        expect(subField).toBeDefined()
        expect(subField?.type).toBe('text')
        expect(subField?.required).toBe(true)
      })

      it('has name sub-field (text, required)', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'name',
        ) as any
        expect(subField).toBeDefined()
        expect(subField?.type).toBe('text')
        expect(subField?.required).toBe(true)
      })

      it('has type sub-field (select, required, default text)', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'type',
        ) as any
        expect(subField).toBeDefined()
        expect(subField?.type).toBe('select')
        expect(subField?.required).toBe(true)
        expect(subField?.defaultValue).toBe('text')
      })

      it('type field has all 6 options', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'type',
        ) as any
        const values = subField?.options?.map((o: any) => o.value)
        expect(values).toHaveLength(6)
        expect(values).toContain('text')
        expect(values).toContain('email')
        expect(values).toContain('tel')
        expect(values).toContain('textarea')
        expect(values).toContain('select')
        expect(values).toContain('checkbox')
      })

      it('has required sub-field (checkbox, default false)', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'required',
        ) as any
        expect(subField).toBeDefined()
        expect(subField?.type).toBe('checkbox')
        expect(subField?.defaultValue).toBe(false)
      })

      it('has options sub-field (textarea, with condition)', () => {
        const subField = field?.fields?.find(
          (f: any) => f.name === 'options',
        ) as any
        expect(subField).toBeDefined()
        expect(subField?.type).toBe('textarea')
        expect(subField?.admin?.description).toBeDefined()
      })
    })
  })

  describe('Slug generation hook', () => {
    it('has a beforeChange hook', () => {
      const hooks = Forms.hooks
      expect(hooks).toBeDefined()
      expect(hooks?.beforeChange).toBeDefined()
      expect(hooks?.beforeChange?.length).toBeGreaterThan(0)
    })

    it('generates lowercase slug from title', () => {
      const hook = Forms.hooks?.beforeChange?.[0]
      expect(hook).toBeDefined()
      if (!hook) return

      const result = hook({
        data: { title: 'Contact Us' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('contact-us')
    })

    it('handles special characters in title', () => {
      const hook = Forms.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { title: "Let's Connect! Sign-Up Form" },
        operation: 'create',
      } as any)

      expect(result.slug).not.toContain("'")
      expect(result.slug).not.toContain('!')
    })

    it('handles multiple spaces and trims', () => {
      const hook = Forms.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { title: '  Newsletter   Signup  ' },
        operation: 'create',
      } as any)

      expect(result.slug).toBe('newsletter-signup')
    })

    it('generates slug on update operation too', () => {
      const hook = Forms.hooks?.beforeChange?.[0]
      if (!hook) return

      const result = hook({
        data: { title: 'Updated Form' },
        operation: 'update',
      } as any)

      expect(result.slug).toBe('updated-form')
    })
  })
})
