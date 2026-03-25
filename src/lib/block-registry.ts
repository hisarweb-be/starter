/**
 * Block Registry — het "plugin systeem" voor page blocks.
 *
 * Hoe een nieuw block type toevoegen (zoals een "plugin"):
 * 1. Definieer het block hier in de registry
 * 2. Voeg een renderer toe in components/blocks/
 * 3. Voeg een editor toe in components/editor/block-config-panel.tsx
 * 4. Alles werkt automatisch in de dashboard editor + publieke rendering
 *
 * In de toekomst: externe plugins kunnen via npm packages worden geregistreerd
 * en dynamisch worden geladen (code splitting per block type).
 */

export type BlockField =
  | { type: "text"; label: string; placeholder?: string }
  | { type: "textarea"; label: string; placeholder?: string; rows?: number }
  | { type: "url"; label: string; placeholder?: string }
  | { type: "color"; label: string }
  | { type: "select"; label: string; options: Array<{ value: string; label: string }> }
  | { type: "array"; label: string; itemFields: Record<string, BlockField> }

export type BlockDefinition = {
  /** Unieke identifier (gebruikt in DB) */
  type: string
  /** Weergavenaam in de editor */
  label: string
  /** Korte beschrijving voor de block picker */
  description: string
  /** Lucide icon naam */
  icon: string
  /** Categorie voor groepering in de block picker */
  category: "content" | "layout" | "media" | "commerce" | "social"
  /** Standaard waarden bij toevoegen */
  defaultData: Record<string, unknown>
  /** Veld definities voor auto-genereerde editors (toekomstig) */
  fields?: Record<string, BlockField>
}

/**
 * De master registry van alle beschikbare block types.
 * Voeg hier nieuwe "plugins" toe.
 */
export const blockRegistry: BlockDefinition[] = [
  // ── Content blocks ──────────────────────────────────────────────────────────
  {
    type: "hero",
    label: "Hero",
    description: "Grote banner met titel, ondertitel en actieknop",
    icon: "Sparkles",
    category: "content",
    defaultData: {
      title: "Welkom",
      subtitle: "Ontdek wat wij te bieden hebben.",
      ctaText: "Meer informatie",
      ctaLink: "#",
    },
  },
  {
    type: "features",
    label: "Features",
    description: "Grid met kenmerken of voordelen",
    icon: "LayoutGrid",
    category: "content",
    defaultData: {
      title: "Onze voordelen",
      features: [
        { title: "Kwaliteit", description: "Wij leveren kwaliteit." },
        { title: "Service", description: "Persoonlijke aandacht." },
        { title: "Innovatie", description: "Altijd vooruitdenken." },
      ],
    },
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Klantbeoordelingen en reviews",
    icon: "MessageSquareQuote",
    category: "social",
    defaultData: {
      title: "Wat klanten zeggen",
      testimonials: [{ quote: "Uitstekende samenwerking!", author: "Klant Naam", role: "CEO" }],
    },
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "Actie-sectie met knop om bezoekers te converteren",
    icon: "MousePointerClick",
    category: "content",
    defaultData: {
      title: "Klaar om te starten?",
      description: "Neem vandaag nog contact op.",
      buttonText: "Neem contact op",
      buttonLink: "/contact",
    },
  },
  {
    type: "rich-text",
    label: "Tekst",
    description: "Vrij tekstveld voor artikelen en content",
    icon: "FileText",
    category: "content",
    defaultData: { content: "Schrijf hier je tekst..." },
  },
  {
    type: "faq-block",
    label: "FAQ",
    description: "Veelgestelde vragen met accordion",
    icon: "HelpCircle",
    category: "content",
    defaultData: {
      title: "Veelgestelde vragen",
      items: [
        { question: "Hoe werkt het?", answer: "Het is heel eenvoudig..." },
        { question: "Wat kost het?", answer: "Bekijk onze prijzen op de tarieven pagina." },
      ],
    },
  },

  // ── Services / Portfolio ─────────────────────────────────────────────────────
  {
    type: "services-block",
    label: "Services",
    description: "Overzicht van diensten of producten",
    icon: "Briefcase",
    category: "content",
    defaultData: {
      title: "Onze diensten",
      services: [
        { title: "Dienst 1", description: "Beschrijving van deze dienst." },
        { title: "Dienst 2", description: "Nog een dienst die wij aanbieden." },
      ],
    },
  },
  {
    type: "portfolio-grid",
    label: "Portfolio",
    description: "Grid van projecten of cases",
    icon: "Image",
    category: "media",
    defaultData: {
      title: "Ons werk",
      items: [],
    },
  },

  // ── Contact ──────────────────────────────────────────────────────────────────
  {
    type: "contact-form",
    label: "Contactformulier",
    description: "Formulier met naam, email en bericht — verzonden via e-mail",
    icon: "Mail",
    category: "content",
    defaultData: {
      title: "Neem contact op",
      subtitle: "Wij reageren binnen 24 uur.",
      namePlaceholder: "Uw naam",
      emailPlaceholder: "uw@email.nl",
      messagePlaceholder: "Uw bericht...",
      buttonText: "Versturen",
      successMessage: "Bedankt! We nemen zo snel mogelijk contact op.",
    },
  },

  // ── Commerce ─────────────────────────────────────────────────────────────────
  {
    type: "pricing",
    label: "Prijzen",
    description: "Prijsplannen vergelijken",
    icon: "CreditCard",
    category: "commerce",
    defaultData: {
      title: "Onze prijzen",
      plans: [
        {
          name: "Starter",
          price: "Gratis",
          features: [{ feature: "1 gebruiker" }, { feature: "5 pagina's" }],
        },
        {
          name: "Pro",
          price: "€29/mnd",
          features: [{ feature: "Onbeperkt gebruikers" }, { feature: "Onbeperkt pagina's" }, { feature: "Support" }],
          highlighted: true,
        },
      ],
    },
  },
]

/** Lookup een block definitie op type */
export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return blockRegistry.find((b) => b.type === type)
}

/** Geeft standaard data voor een nieuw block van dit type */
export function getDefaultBlockData(type: string): Record<string, unknown> {
  return getBlockDefinition(type)?.defaultData ?? { title: type }
}

/** Alle block types per categorie */
export function getBlocksByCategory(category: BlockDefinition["category"]) {
  return blockRegistry.filter((b) => b.category === category)
}

/** Labels voor weergave */
export const blockTypeLabels = Object.fromEntries(
  blockRegistry.map((b) => [b.type, b.label])
)
