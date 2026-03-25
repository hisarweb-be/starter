/**
 * HisarWeb Package & Module Registry
 *
 * Centrale definitie van alle pakketten (services die HisarWeb aanbiedt)
 * en dashboard-modules (features die ingeschakeld worden per organisatie).
 *
 * - Package   = wat de klant heeft gekocht bij HisarWeb
 * - Module    = welke dashboard-features daardoor worden ontgrendeld
 */

// ─── Dashboard Modules ────────────────────────────────────────────────────────

export type DashboardModule = {
  id: string
  label: string
  description: string
  icon: string
  category: "basis" | "content" | "marketing" | "commerce" | "advanced"
  route: string
}

export const dashboardModules: DashboardModule[] = [
  // Basis
  {
    id: "homepage",
    label: "Homepage",
    description: "Hoofdpagina van de website",
    icon: "Home",
    category: "basis",
    route: "/dashboard/pages",
  },
  {
    id: "about",
    label: "Over Ons",
    description: "Bedrijfspagina met verhaal en team",
    icon: "Building2",
    category: "basis",
    route: "/dashboard/pages",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Contactpagina met formulier en gegevens",
    icon: "Mail",
    category: "basis",
    route: "/dashboard/pages",
  },

  // Content
  {
    id: "services",
    label: "Diensten",
    description: "Overzicht van diensten of producten",
    icon: "Briefcase",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Projecten, cases en referenties",
    icon: "FolderOpen",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "team",
    label: "Team",
    description: "Teamleden en medewerkers",
    icon: "Users",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "testimonials",
    label: "Reviews",
    description: "Klantbeoordelingen en referenties",
    icon: "Star",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Veelgestelde vragen",
    icon: "HelpCircle",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "pricing",
    label: "Prijzen",
    description: "Tarieven en prijsplannen",
    icon: "CreditCard",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "gallery",
    label: "Galerij",
    description: "Foto- en mediagalerij",
    icon: "Images",
    category: "content",
    route: "/dashboard/pages",
  },
  {
    id: "events",
    label: "Evenementen",
    description: "Agenda en evenementen overzicht",
    icon: "Calendar",
    category: "content",
    route: "/dashboard/pages",
  },

  // Marketing
  {
    id: "blog",
    label: "Blog",
    description: "Nieuwsartikelen en kennisdeling",
    icon: "BookOpen",
    category: "marketing",
    route: "/dashboard/pages",
  },
  {
    id: "newsletter",
    label: "Nieuwsbrief",
    description: "E-mail nieuwsbrief inschrijvingen",
    icon: "Send",
    category: "marketing",
    route: "/dashboard/pages",
  },
  {
    id: "seo",
    label: "SEO Tools",
    description: "Zoekmachineoptimalisatie tools",
    icon: "Search",
    category: "marketing",
    route: "/dashboard/settings",
  },

  // Commerce
  {
    id: "shop",
    label: "Webshop",
    description: "Producten en online verkoop",
    icon: "ShoppingCart",
    category: "commerce",
    route: "/dashboard/pages",
  },
  {
    id: "booking",
    label: "Reserveringen",
    description: "Online afspraken en reserveringen",
    icon: "CalendarCheck",
    category: "commerce",
    route: "/dashboard/pages",
  },
]

// ─── HisarWeb Pakketten ───────────────────────────────────────────────────────

export type HisarPackage = {
  id: string
  name: string
  shortDescription: string
  description: string
  category: "websites" | "branding" | "marketing" | "technologie" | "modules"
  priceFrom: number | null
  priceLabel: string
  priceNote?: string
  features: string[]
  includedModules: string[]
  deliverables?: string[]
  popular?: boolean
  icon: string
  color: string
}

export const hisarPackages: HisarPackage[] = [
  // ── Websites & Shops ──────────────────────────────────────────────────────
  {
    id: "website-basis",
    name: "Website",
    shortDescription: "Professionele bedrijfswebsite",
    description:
      "Een complete, professionele bedrijfswebsite op maat. Responsive design, SEO-geoptimaliseerd en eenvoudig te beheren via het dashboard.",
    category: "websites",
    priceFrom: 850,
    priceLabel: "Vanaf €850",
    priceNote: "Vaste projectprijs, geen verborgen kosten",
    features: [
      "Responsive design (mobiel & desktop)",
      "SEO-geoptimaliseerde structuur",
      "Contactformulier",
      "Google Analytics integratie",
      "1 maand gratis support",
      "Dashboard toegang",
    ],
    includedModules: ["homepage", "about", "services", "contact"],
    deliverables: ["Ontwerp + development", "Deployment", "1 revisieronde"],
    icon: "Globe",
    color: "violet",
  },
  {
    id: "website-pro",
    name: "Website Pro",
    shortDescription: "Uitgebreide bedrijfswebsite met extra pagina's",
    description:
      "Uitgebreide website met portfolio, testimonials, team en alle content die een groeiend bedrijf nodig heeft.",
    category: "websites",
    priceFrom: 1450,
    priceLabel: "Vanaf €1.450",
    priceNote: "Vaste projectprijs",
    popular: true,
    features: [
      "Alles uit Website Basis",
      "Portfolio / Cases pagina",
      "Team pagina",
      "Testimonials sectie",
      "FAQ pagina",
      "Prijzenblok",
      "Blog module",
      "3 maanden gratis support",
    ],
    includedModules: ["homepage", "about", "services", "contact", "portfolio", "team", "testimonials", "faq", "pricing", "blog"],
    deliverables: ["Ontwerp + development", "Deployment", "3 revisierondes", "SEO setup"],
    icon: "Globe",
    color: "violet",
  },
  {
    id: "webshop",
    name: "Webshop",
    shortDescription: "Complete online winkel",
    description:
      "Een volledige webshop met productbeheer, betalingen, bestelflow en klantenbeheer. Gebaseerd op bewezen e-commerce technologie.",
    category: "websites",
    priceFrom: 2200,
    priceLabel: "Vanaf €2.200",
    priceNote: "Vaste projectprijs",
    features: [
      "Productcatalogus & beheer",
      "Betaalintegratie (Stripe/Mollie)",
      "Winkelmandje & checkout",
      "Klantaccounts",
      "Voorraad- en orderbeheer",
      "BTW-configuratie",
      "Mobiele checkout",
    ],
    includedModules: ["homepage", "about", "services", "contact", "shop", "testimonials", "faq"],
    icon: "ShoppingCart",
    color: "blue",
  },

  // ── Branding & Logo ───────────────────────────────────────────────────────
  {
    id: "logo-ontwerp",
    name: "Logo Ontwerp",
    shortDescription: "Professioneel logo op maat",
    description:
      "Een uniek, tijdloos logo dat uw merk vertegenwoordigt. Inclusief alle bestandsformaten voor print en digitaal gebruik.",
    category: "branding",
    priceFrom: 350,
    priceLabel: "Vanaf €350",
    features: [
      "3 initiële concepten",
      "2 revisierondes",
      "Alle bestandsformaten (SVG, PNG, PDF)",
      "Kleur- en zwart-wit varianten",
      "Brand guidelines (basic)",
    ],
    includedModules: [],
    icon: "Pen",
    color: "amber",
  },
  {
    id: "huisstijl-branding",
    name: "Huisstijl & Branding",
    shortDescription: "Volledige visuele identiteit",
    description:
      "Complete merkidentiteit: logo, kleuren, typografie, visitekaartjes en brand guidelines. Alles wat uw merk consistent en professioneel maakt.",
    category: "branding",
    priceFrom: 1200,
    priceLabel: "Vanaf €1.200",
    features: [
      "Logo ontwerp (5 concepten)",
      "Kleurpalet & typografie",
      "Brand guidelines document",
      "Visitekaartje ontwerp",
      "Briefhoofd & e-mail handtekening",
      "Social media templates",
    ],
    includedModules: [],
    icon: "Palette",
    color: "amber",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    shortDescription: "Professioneel interfaceontwerp",
    description:
      "Op maat gemaakte UI/UX designs voor websites, apps en platforms. Van wireframes tot pixel-perfect designs in Figma.",
    category: "branding",
    priceFrom: 750,
    priceLabel: "Vanaf €750",
    features: [
      "User research & analyse",
      "Wireframes",
      "High-fidelity designs in Figma",
      "Prototype & user flow",
      "Design system (components)",
    ],
    includedModules: [],
    icon: "Layout",
    color: "amber",
  },

  // ── Online Marketing ──────────────────────────────────────────────────────
  {
    id: "marketing-pack",
    name: "Marketing Pack",
    shortDescription: "Volledige online marketing setup",
    description:
      "Alles wat u nodig heeft om online gevonden te worden: SEO, Google Ads, social media strategie en maandelijkse rapportage.",
    category: "marketing",
    priceFrom: 499,
    priceLabel: "Vanaf €499/mnd",
    priceNote: "Maandelijkse retainer, min. 3 maanden",
    popular: true,
    features: [
      "SEO optimalisatie",
      "Google Ads beheer",
      "Social media content (4x/maand)",
      "Maandelijkse rapportage",
      "Concurrentieanalyse",
      "Zoekwoordonderzoek",
    ],
    includedModules: ["blog", "newsletter", "seo"],
    icon: "TrendingUp",
    color: "green",
  },
  {
    id: "online-marketing",
    name: "Online Marketing",
    shortDescription: "Strategische online marketing",
    description:
      "Gerichte online marketing campagnes die leads genereren en klanten aantrekken.",
    category: "marketing",
    priceFrom: 299,
    priceLabel: "Vanaf €299/mnd",
    features: [
      "SEO audit & optimalisatie",
      "Content strategie",
      "Social media beheer",
      "E-mail marketing",
    ],
    includedModules: ["blog", "newsletter"],
    icon: "BarChart2",
    color: "green",
  },
  {
    id: "copywriting",
    name: "Copywriting",
    shortDescription: "Overtuigende webteksten",
    description:
      "Professionele webteksten die bezoekers overtuigen en scoren in Google. Van homepage copy tot complete website tekstuele content.",
    category: "marketing",
    priceFrom: 150,
    priceLabel: "Vanaf €150/pagina",
    features: [
      "SEO-geoptimaliseerde teksten",
      "Call-to-action copywriting",
      "Brand voice & tone",
      "1 revisieronde inbegrepen",
    ],
    includedModules: [],
    icon: "FileText",
    color: "green",
  },

  // ── Video & Audio ────────────────────────────────────────────────────────
  {
    id: "video-animatie",
    name: "Video & Animatie",
    shortDescription: "Professionele bedrijfsvideo's",
    description:
      "Van bedrijfsfilm tot uitlegvideo's en animaties. Wij produceren video content die uw boodschap krachtig overbrengt.",
    category: "marketing",
    priceFrom: 650,
    priceLabel: "Vanaf €650",
    features: [
      "Script & storyboard",
      "Opnames of animatie",
      "Professionele montage",
      "Ondertiteling",
      "Geschikt voor web & social",
    ],
    includedModules: [],
    icon: "Video",
    color: "pink",
  },
  {
    id: "audio-podcast",
    name: "Audio & Podcast",
    shortDescription: "Podcast productie & audio branding",
    description:
      "Professionele podcastproductie, jingles en audio branding. Wij zorgen voor een heldere, kwalitatieve geluidservaring.",
    category: "marketing",
    priceFrom: 350,
    priceLabel: "Vanaf €350",
    features: [
      "Audio opname & montage",
      "Intro/outro jingle",
      "Publicatie op platforms",
      "Show notes copywriting",
    ],
    includedModules: [],
    icon: "Mic",
    color: "pink",
  },

  // ── Technologie ───────────────────────────────────────────────────────────
  {
    id: "web-applicatie",
    name: "Web Applicatie",
    shortDescription: "Maatwerk web applicatie",
    description:
      "Op maat ontwikkelde web applicaties voor complexe bedrijfsprocessen. Van interne tools tot klantportalen en dashboards.",
    category: "technologie",
    priceFrom: 3500,
    priceLabel: "Vanaf €3.500",
    priceNote: "Op basis van projectscope",
    features: [
      "Maatwerk development",
      "Database & API design",
      "Authenticatie & autorisatie",
      "Dashboard & rapportage",
      "API integraties",
      "Hosting & deployment",
    ],
    includedModules: [],
    icon: "Code",
    color: "cyan",
  },
  {
    id: "saas-ontwikkeling",
    name: "SaaS Ontwikkeling",
    shortDescription: "Software as a Service platform",
    description:
      "Bouw uw eigen SaaS product met HisarWeb. Van MVP tot volledig uitgewerkt platform met multi-tenancy, billing en dashboard.",
    category: "technologie",
    priceFrom: 7500,
    priceLabel: "Vanaf €7.500",
    priceNote: "Op basis van projectscope",
    features: [
      "Multi-tenant architectuur",
      "Betalingen & abonnementen (Stripe)",
      "Admin & klantdashboard",
      "API & webhooks",
      "Schaalbare infrastructuur",
      "6 maanden support",
    ],
    includedModules: [],
    icon: "Server",
    color: "cyan",
  },
  {
    id: "mobiele-app",
    name: "Mobiele App",
    shortDescription: "iOS & Android app ontwikkeling",
    description:
      "Native of cross-platform mobiele apps voor iOS en Android. Van concept tot publicatie in de App Store en Google Play.",
    category: "technologie",
    priceFrom: 5000,
    priceLabel: "Vanaf €5.000",
    features: [
      "iOS & Android (React Native)",
      "UI/UX design inbegrepen",
      "Backend & API",
      "App Store publicatie",
      "Push notificaties",
      "Offline functionaliteit",
    ],
    includedModules: [],
    icon: "Smartphone",
    color: "cyan",
  },
  {
    id: "maatwerk-software",
    name: "Maatwerk Software",
    shortDescription: "Op maat gemaakte bedrijfssoftware",
    description:
      "Bedrijfssoftware volledig afgestemd op uw processen. CRM, ERP, automatiseringen en integraties tussen bestaande systemen.",
    category: "technologie",
    priceFrom: 4500,
    priceLabel: "Vanaf €4.500",
    features: [
      "Procesanalyse & requirements",
      "Maatwerk development",
      "Integraties met bestaande systemen",
      "Gebruikerstraining",
      "Support & onderhoud",
    ],
    includedModules: [],
    icon: "Cpu",
    color: "cyan",
  },
  {
    id: "ai-oplossingen",
    name: "AI Oplossingen",
    shortDescription: "AI & automatisering voor uw bedrijf",
    description:
      "Integreer AI in uw bedrijfsprocessen. Van chatbots en content generatie tot data-analyse en intelligente automatiseringen.",
    category: "technologie",
    priceFrom: 1500,
    priceLabel: "Vanaf €1.500",
    features: [
      "AI chatbot implementatie",
      "Content automatisering",
      "Data-analyse & insights",
      "Workflow automatisering",
      "LLM integraties (OpenAI, Gemini)",
    ],
    includedModules: [],
    icon: "BrainCircuit",
    color: "cyan",
  },
  {
    id: "consultancy",
    name: "Consultancy",
    shortDescription: "Strategisch digitaal advies",
    description:
      "Onafhankelijk advies over digitale strategie, technologiekeuzes en digitale transformatie voor uw organisatie.",
    category: "technologie",
    priceFrom: 125,
    priceLabel: "€125/uur",
    features: [
      "Technische audit",
      "Digitale strategie",
      "Technology stack advies",
      "Architectuurontwerp",
      "Vendor selectie",
    ],
    includedModules: [],
    icon: "Lightbulb",
    color: "cyan",
  },
]

// ─── Losse Modules (add-ons) ──────────────────────────────────────────────────

export type LooseModule = {
  id: string
  name: string
  description: string
  priceFrom: number | null
  priceLabel: string
  category: "functionaliteit" | "integraties" | "performance" | "veiligheid"
  dashboardModules: string[]
  icon: string
}

export const looseModules: LooseModule[] = [
  {
    id: "meertaligheid",
    name: "Meertaligheid",
    description: "Website in meerdere talen (NL, FR, EN, DE, TR)",
    priceFrom: 250,
    priceLabel: "€250 per taal",
    category: "functionaliteit",
    dashboardModules: [],
    icon: "Languages",
  },
  {
    id: "online-reservering",
    name: "Online Reservering",
    description: "Kalender-gebaseerd reserveringssysteem",
    priceFrom: 350,
    priceLabel: "Vanaf €350",
    category: "functionaliteit",
    dashboardModules: ["booking"],
    icon: "CalendarCheck",
  },
  {
    id: "live-chat",
    name: "Live Chat",
    description: "Realtime chat widget voor klantenservice",
    priceFrom: 150,
    priceLabel: "€150 setup",
    category: "integraties",
    dashboardModules: [],
    icon: "MessageCircle",
  },
  {
    id: "cookie-consent",
    name: "Cookie Consent",
    description: "GDPR-conforme cookie banner en beheer",
    priceFrom: 99,
    priceLabel: "€99",
    category: "veiligheid",
    dashboardModules: [],
    icon: "Shield",
  },
  {
    id: "google-analytics",
    name: "Analytics Koppeling",
    description: "Google Analytics 4 & Search Console setup",
    priceFrom: 99,
    priceLabel: "€99",
    category: "integraties",
    dashboardModules: ["seo"],
    icon: "BarChart",
  },
  {
    id: "betalingen",
    name: "Betalingsmodule",
    description: "Stripe of Mollie betalingen integratie",
    priceFrom: 299,
    priceLabel: "Vanaf €299",
    category: "functionaliteit",
    dashboardModules: ["shop"],
    icon: "CreditCard",
  },
  {
    id: "nieuwsbrief",
    name: "Nieuwsbrief",
    description: "E-mail marketing integratie (Mailchimp/Resend)",
    priceFrom: 150,
    priceLabel: "€150",
    category: "integraties",
    dashboardModules: ["newsletter"],
    icon: "Mail",
  },
  {
    id: "snelheid-optimalisatie",
    name: "Snelheidsoptimalisatie",
    description: "Core Web Vitals optimalisatie voor betere Google ranking",
    priceFrom: 199,
    priceLabel: "€199",
    category: "performance",
    dashboardModules: ["seo"],
    icon: "Zap",
  },
  {
    id: "ssl-beveiliging",
    name: "Extra Beveiliging",
    description: "Firewall, DDoS-bescherming en beveiligingsscan",
    priceFrom: 149,
    priceLabel: "€149/jaar",
    category: "veiligheid",
    dashboardModules: [],
    icon: "Lock",
  },
  {
    id: "crm-koppeling",
    name: "CRM Koppeling",
    description: "Integratie met HubSpot, Salesforce of ander CRM",
    priceFrom: 399,
    priceLabel: "Vanaf €399",
    category: "integraties",
    dashboardModules: [],
    icon: "Users",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPackageById(id: string) {
  return hisarPackages.find((p) => p.id === id)
}

export function getPackagesByCategory(category: HisarPackage["category"]) {
  return hisarPackages.filter((p) => p.category === category)
}

export function getModulesForPackages(packageIds: string[]): string[] {
  const allModules = new Set<string>()
  for (const id of packageIds) {
    const pkg = getPackageById(id)
    if (pkg) pkg.includedModules.forEach((m) => allModules.add(m))
  }
  return Array.from(allModules)
}

export function getDashboardModuleById(id: string) {
  return dashboardModules.find((m) => m.id === id)
}

export const packageCategoryLabels: Record<HisarPackage["category"], string> = {
  websites: "Websites & Shops",
  branding: "Branding & Logo",
  marketing: "Online Marketing",
  technologie: "Technologie",
  modules: "Losse Modules",
}

export const packageCategoryOrder: HisarPackage["category"][] = [
  "websites",
  "branding",
  "marketing",
  "technologie",
]
