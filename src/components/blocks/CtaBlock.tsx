import type { CtaBlockData } from "./types"

export function CtaBlockComponent({
  title,
  description,
  buttonText,
  buttonLink,
}: CtaBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-12">
        <h2 className="mb-4 text-3xl font-bold">{title}</h2>
        {description ? (
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">{description}</p>
        ) : null}
        <a
          href={buttonLink}
          className="inline-flex rounded-full bg-background px-8 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background/90"
        >
          {buttonText}
        </a>
      </div>
    </section>
  )
}
