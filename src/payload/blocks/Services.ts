import type { Block } from 'payload'

export const ServicesBlock: Block = {
    slug: 'services-block',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'services',
            type: 'relationship',
            relationTo: 'services',
            hasMany: true,
        },
    ],
}
