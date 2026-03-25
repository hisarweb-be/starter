import type { Block } from 'payload'

export const PortfolioGridBlock: Block = {
    slug: 'portfolio-grid',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'items',
            type: 'relationship',
            relationTo: 'portfolio',
            hasMany: true,
        },
    ],
}
