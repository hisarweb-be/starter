import type { Block } from 'payload'

export const FeaturesBlock: Block = {
    slug: 'features',
    labels: {
        singular: 'Features',
        plural: 'Features sections',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'features',
            type: 'array',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'icon',
                    type: 'text',
                },
            ],
        },
    ],
}
