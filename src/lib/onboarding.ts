/**
 * Default block templates per industry for new organization homepages.
 */

type BlockData = Record<string, unknown> & { blockType: string }

const industryTemplates: Record<string, BlockData[]> = {
  agency: [
    {
      blockType: "hero",
      title: "Creatieve oplossingen voor groei",
      subtitle: "Wij helpen bedrijven groeien met strategie, design en technologie.",
      ctaText: "Bekijk ons werk",
      ctaLink: "/portfolio",
    },
    {
      blockType: "features",
      title: "Onze diensten",
      features: [
        { title: "Webdesign", description: "Moderne, responsieve websites die converteren." },
        { title: "Branding", description: "Merkidentiteit die blijft hangen." },
        { title: "Marketing", description: "Datagedreven campagnes voor groei." },
      ],
    },
    {
      blockType: "testimonials",
      title: "Wat klanten zeggen",
      testimonials: [
        { quote: "Uitstekende samenwerking en prachtig resultaat.", author: "Klant", role: "CEO" },
      ],
    },
    {
      blockType: "cta",
      title: "Klaar voor de volgende stap?",
      description: "Neem contact met ons op voor een vrijblijvend gesprek.",
      buttonText: "Neem contact op",
      buttonLink: "/contact",
    },
  ],
  restaurant: [
    {
      blockType: "hero",
      title: "Welkom bij ons restaurant",
      subtitle: "Geniet van de beste gerechten in een gezellige sfeer.",
      ctaText: "Bekijk menu",
      ctaLink: "/services",
    },
    {
      blockType: "features",
      title: "Waarom bij ons eten?",
      features: [
        { title: "Verse ingredienten", description: "Dagelijks vers van de markt." },
        { title: "Gezellige sfeer", description: "Een warm welkom voor iedereen." },
        { title: "Uitgebreid menu", description: "Voor elk wat wils." },
      ],
    },
    {
      blockType: "cta",
      title: "Reserveer nu",
      description: "Bel ons of reserveer online.",
      buttonText: "Reserveren",
      buttonLink: "/contact",
    },
  ],
  retail: [
    {
      blockType: "hero",
      title: "Ontdek ons aanbod",
      subtitle: "Kwaliteitsproducten voor de beste prijs.",
      ctaText: "Shop nu",
      ctaLink: "/services",
    },
    {
      blockType: "features",
      title: "Waarom bij ons?",
      features: [
        { title: "Breed assortiment", description: "Alles wat je nodig hebt." },
        { title: "Snelle levering", description: "Vandaag besteld, morgen in huis." },
        { title: "Klantenservice", description: "Altijd bereikbaar voor vragen." },
      ],
    },
    {
      blockType: "cta",
      title: "Neem contact op",
      buttonText: "Contact",
      buttonLink: "/contact",
      description: "Vragen? Wij helpen je graag.",
    },
  ],
}

const defaultTemplate: BlockData[] = [
  {
    blockType: "hero",
    title: "Welkom",
    subtitle: "Ontdek wat wij te bieden hebben.",
    ctaText: "Meer informatie",
    ctaLink: "/about",
  },
  {
    blockType: "features",
    title: "Wat wij doen",
    features: [
      { title: "Kwaliteit", description: "Wij staan voor kwaliteit in alles wat we doen." },
      { title: "Service", description: "Persoonlijke aandacht voor elke klant." },
      { title: "Innovatie", description: "Altijd op zoek naar betere oplossingen." },
    ],
  },
  {
    blockType: "cta",
    title: "Neem contact op",
    description: "Benieuwd wat wij voor u kunnen betekenen?",
    buttonText: "Contact",
    buttonLink: "/contact",
  },
]

export function getDefaultBlocks(industry: string, companyName: string): BlockData[] {
  const template = industryTemplates[industry.toLowerCase()] ?? defaultTemplate

  // Personalize hero title with company name
  return template.map((block) => {
    if (block.blockType === "hero" && typeof block.title === "string") {
      return { ...block, title: `Welkom bij ${companyName}` }
    }
    return { ...block }
  })
}
