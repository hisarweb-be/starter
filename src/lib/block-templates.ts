import type { PageBlockLike } from "@/components/blocks/types"

export type BlockTemplate = {
  id: string
  name: string
  description: string
  category: string
  blocks: PageBlockLike[]
}

export const blockTemplates: BlockTemplate[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Hero, features, testimonials en CTA sectie",
    category: "Marketing",
    blocks: [
      {
        blockType: "hero",
        title: "Welkom bij ons platform",
        subtitle: "De beste oplossing voor uw bedrijf. Start vandaag nog.",
        ctaText: "Aan de slag",
        ctaLink: "/contact",
      },
      {
        blockType: "features",
        title: "Waarom wij?",
        features: [
          { title: "Snel & Betrouwbaar", description: "Onze infrastructuur garandeert 99.9% uptime.", icon: "zap" },
          { title: "Veilig", description: "Enterprise-grade beveiliging standaard inbegrepen.", icon: "shield" },
          { title: "Schaalbaar", description: "Groei moeiteloos mee met uw bedrijf.", icon: "trending-up" },
        ],
      },
      {
        blockType: "testimonials",
        title: "Wat klanten zeggen",
        testimonials: [
          { quote: "Uitstekende service en kwaliteit.", author: "Jan de Vries", role: "CEO, TechBedrijf" },
          { quote: "Heeft onze workflow volledig getransformeerd.", author: "Lisa Bakker", role: "CTO, StartupNL" },
        ],
      },
      {
        blockType: "cta",
        title: "Klaar om te beginnen?",
        description: "Neem vandaag nog contact met ons op voor een vrijblijvend gesprek.",
        buttonText: "Contact opnemen",
        buttonLink: "/contact",
      },
    ],
  },
  {
    id: "about-us",
    name: "Over Ons",
    description: "Bedrijfsverhaal met timeline en team sectie",
    category: "Bedrijf",
    blocks: [
      {
        blockType: "hero",
        title: "Over Ons",
        subtitle: "Leer ons team en onze missie kennen.",
      },
      {
        blockType: "rich-text",
        content: "Wij zijn een team van gepassioneerde professionals die geloven in innovatie en kwaliteit.",
      },
      {
        blockType: "timeline",
        title: "Onze Geschiedenis",
        events: [
          { date: "2020", title: "Opgericht", description: "Het begin van ons avontuur." },
          { date: "2022", title: "Groei", description: "Uitbreiding naar 50+ klanten." },
          { date: "2024", title: "Innovatie", description: "Lancering van ons nieuwe platform." },
        ],
      },
    ],
  },
  {
    id: "contact-page",
    name: "Contact",
    description: "Contactformulier met kaart en bedrijfsgegevens",
    category: "Bedrijf",
    blocks: [
      {
        blockType: "hero",
        title: "Neem Contact Op",
        subtitle: "We horen graag van u. Vul het formulier in of bezoek ons kantoor.",
      },
      {
        blockType: "contact-form",
        title: "Stuur ons een bericht",
        buttonText: "Versturen",
        successMessage: "Bedankt! We nemen zo snel mogelijk contact met u op.",
      },
      {
        blockType: "map",
        title: "Ons Kantoor",
        latitude: 51.2194,
        longitude: 4.4025,
        zoom: 15,
        caption: "Antwerpen, Belgie",
      },
    ],
  },
  {
    id: "services-page",
    name: "Diensten",
    description: "Diensten overzicht met pricing en FAQ",
    category: "Marketing",
    blocks: [
      {
        blockType: "hero",
        title: "Onze Diensten",
        subtitle: "Professionele oplossingen voor elk budget.",
      },
      {
        blockType: "features",
        title: "Wat wij bieden",
        features: [
          { title: "Webdesign", description: "Moderne en responsieve websites op maat.", icon: "layout" },
          { title: "Development", description: "Custom applicaties en integraties.", icon: "code" },
          { title: "Marketing", description: "SEO, advertenties en social media.", icon: "megaphone" },
        ],
      },
      {
        blockType: "pricing",
        title: "Prijzen",
        plans: [
          { name: "Starter", price: "€499", features: [{ feature: "5 pagina's" }, { feature: "Basis SEO" }], buttonText: "Kies Starter", buttonLink: "/contact" },
          { name: "Professional", price: "€999", features: [{ feature: "15 pagina's" }, { feature: "Geavanceerde SEO" }, { feature: "Analytics" }], buttonText: "Kies Pro", buttonLink: "/contact" },
          { name: "Enterprise", price: "Op maat", features: [{ feature: "Onbeperkt" }, { feature: "Dedicated support" }, { feature: "SLA" }], buttonText: "Contact", buttonLink: "/contact" },
        ],
      },
      {
        blockType: "accordion",
        title: "Veelgestelde Vragen",
        items: [
          { title: "Hoe lang duurt een project?", content: "Gemiddeld 4-8 weken, afhankelijk van de scope." },
          { title: "Bieden jullie onderhoud aan?", content: "Ja, we bieden maandelijkse onderhoudspakketten aan." },
          { title: "Kan ik mijn website zelf beheren?", content: "Absoluut! Alle websites komen met een gebruiksvriendelijk CMS." },
        ],
      },
    ],
  },
  {
    id: "portfolio-page",
    name: "Portfolio",
    description: "Projecten showcase met galerij",
    category: "Marketing",
    blocks: [
      {
        blockType: "hero",
        title: "Ons Portfolio",
        subtitle: "Bekijk een selectie van onze recente projecten.",
      },
      {
        blockType: "gallery",
        title: "Recente Projecten",
        columns: 3,
        images: [],
      },
      {
        blockType: "cta",
        title: "Geinteresseerd?",
        description: "Laten we samen uw project bespreken.",
        buttonText: "Offerte aanvragen",
        buttonLink: "/contact",
      },
    ],
  },
  {
    id: "blank",
    name: "Lege pagina",
    description: "Start met een lege pagina",
    category: "Basis",
    blocks: [],
  },
]
