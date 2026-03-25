import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
    slug: 'testimonials',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'testimonials',
            type: 'array',
            fields: [
                {
                    name: 'quote',
                    type: 'textarea',
                    required: true,
                },
                {
                    name: 'author',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'role',
                    type: 'text',
                },
                {
                    name: 'avatar',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
}
