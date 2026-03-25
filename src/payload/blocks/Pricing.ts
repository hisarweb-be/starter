import type { Block } from 'payload'

export const PricingBlock: Block = {
    slug: 'pricing',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'plans',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'price',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'features',
                    type: 'array',
                    fields: [
                        {
                            name: 'feature',
                            type: 'text',
                        },
                    ],
                },
                {
                    name: 'buttonText',
                    type: 'text',
                },
                {
                    name: 'buttonLink',
                    type: 'text',
                },
            ],
        },
    ],
}
