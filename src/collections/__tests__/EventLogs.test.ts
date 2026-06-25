import { describe, it, expect } from 'vitest'
import { EventLogs } from '../EventLogs'

describe('EventLogs collection', () => {
  describe('Collection structure', () => {
    it('has correct slug', () => {
      expect(EventLogs.slug).toBe('event-logs')
    })

    it('uses event as display title', () => {
      expect(EventLogs.admin?.useAsTitle).toBe('event')
    })

    it('is in System admin group', () => {
      expect(EventLogs.admin?.group).toBe('System')
    })

    it('has timestamps enabled', () => {
      expect(EventLogs.timestamps).toBe(true)
    })
  })

  describe('Access control', () => {
    it('allows authenticated users to create', () => {
      const access = EventLogs.access
      expect(access?.create).toBeDefined()
      if (typeof access?.create !== 'function') return

      const adminCtx = { req: { user: { id: '1', role: 'admin' } } } as any
      const anonCtx = { req: { user: null } } as any

      expect(access.create(adminCtx)).toBe(true)
      expect(access.create(anonCtx)).toBe(false)
    })

    it('allows authenticated users to read', () => {
      const access = EventLogs.access
      expect(access?.read).toBeDefined()
      if (typeof access?.read !== 'function') return

      const adminCtx = { req: { user: { id: '1', role: 'admin' } } } as any
      const anonCtx = { req: { user: null } } as any

      expect(access.read(adminCtx)).toBe(true)
      expect(access.read(anonCtx)).toBe(false)
    })

    it('denies all update operations', () => {
      const access = EventLogs.access
      expect(typeof access?.update).toBe('function')
      if (typeof access?.update !== 'function') return

      expect(access.update({ req: { user: { id: '1' } } } as any)).toBe(false)
      expect(access.update({ req: { user: null } } as any)).toBe(false)
    })

    it('denies all delete operations', () => {
      const access = EventLogs.access
      expect(typeof access?.delete).toBe('function')
      if (typeof access?.delete !== 'function') return

      expect(access.delete({ req: { user: { id: '1' } } } as any)).toBe(false)
      expect(access.delete({ req: { user: null } } as any)).toBe(false)
    })
  })

  describe('Fields', () => {
    it('has event text field (required)', () => {
      const field = EventLogs.fields?.find(
        (f: any) => f.name === 'event',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
      expect(field?.required).toBe(true)
    })

    it('has orderId text field', () => {
      const field = EventLogs.fields?.find(
        (f: any) => f.name === 'orderId',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
    })

    it('has status text field', () => {
      const field = EventLogs.fields?.find(
        (f: any) => f.name === 'status',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('text')
    })

    it('has payload json field', () => {
      const field = EventLogs.fields?.find(
        (f: any) => f.name === 'payload',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('json')
    })

    it('has response json field', () => {
      const field = EventLogs.fields?.find(
        (f: any) => f.name === 'response',
      ) as any
      expect(field).toBeDefined()
      expect(field?.type).toBe('json')
    })
  })

  describe('Field count', () => {
    it('has exactly 5 fields', () => {
      expect(EventLogs.fields).toHaveLength(5)
    })
  })
})
