import type { RichTextBlockData } from "./types"

export function RichTextBlockComponent({ content }: RichTextBlockData) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12">
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: typeof content === "string" ? content : "" }}
      />
    </section>
  )
}
