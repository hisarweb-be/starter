import type { Block } from 'payload'

export const FaqBlock: Block = {
    slug: 'faq-block',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'items',
            type: 'relationship',
            relationTo: 'faq',
            hasMany: true,
        },
    ],
}
