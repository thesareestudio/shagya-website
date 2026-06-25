import type { CollectionConfig } from 'payload'

export const EventLogs: CollectionConfig = {
  slug: 'event-logs',
  admin: {
    useAsTitle: 'event',
    group: 'System',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => !!user,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'event',
      type: 'text',
      required: true,
    },
    {
      name: 'orderId',
      type: 'text',
    },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'payload',
      type: 'json',
    },
    {
      name: 'response',
      type: 'json',
    },
  ],
  timestamps: true,
}
