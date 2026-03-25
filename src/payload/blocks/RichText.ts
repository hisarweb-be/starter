import type { Block } from 'payload'

export const RichTextBlock: Block = {
    slug: 'rich-text',
    fields: [
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
    ],
}
