import type { PageBlockLike } from "@/components/blocks/types"
import type { AppLocale } from "@/lib/site"

export type DemoPage = {
  title: string
  slug: string
  locale: AppLocale
  summary: string
  content: string
  blocks?: PageBlockLike[]
}

export type DemoPost = {
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
}

export type DemoService = {
  title: string
  slug: string
  summary: string
  featured: boolean
}

export type DemoPortfolioItem = {
  title: string
  slug: string
  summary: string
}

export type DemoFaqItem = {
  question: string
  answer: string
  category: string
}

export type DemoSetting = {
  key: string
  value: string
  group: string
}

export type DemoContent = {
  globals: {
    siteConfig: {
      siteName: string
      tagline: string
      defaultLocale: AppLocale
      allowRegistration: boolean
    }
    navigation: {
      items: Array<{ label: string; href: string }>
    }
    footer: {
      headline: string
      description: string
      links: Array<{ label: string; href: string }>
    }
  }
  pages: DemoPage[]
  posts: DemoPost[]
  services: DemoService[]
  portfolio: DemoPortfolioItem[]
  faq: DemoFaqItem[]
  settings: DemoSetting[]
}

export const defaultDemoContent: DemoContent = {
  globals: {
    siteConfig: {
      siteName: "HisarWeb Starter Demo",
      tagline:
        "Demo-installatie met direct bruikbare content, modules en operationeel overzicht.",
      defaultLocale: "nl",
      allowRegistration: true,
    },
    navigation: {
      items: [
        { label: "Home", href: "/" },
        { label: "Over ons", href: "/about" },
        { label: "Diensten", href: "/services" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Prijzen", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    footer: {
      headline: "Demo-content die direct verkoop, onboarding en validatie ondersteunt.",
      description:
        "Deze demo-installatie vult de starter met representatieve pagina’s, services, FAQ-items en voorbeeldcontent zodat teams sneller kunnen presenteren en testen.",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Setup", href: "/setup" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },
  pages: [
    {
      title: "Home",
      slug: "home",
      locale: "nl",
      summary: "Een homepage die direct productwaarde, positionering en volgende acties zichtbaar maakt.",
      content:
        "Gebruik deze starter om snel van positionering naar live site te gaan, met setup, contentblokken en operationeel overzicht in één basis.",
      blocks: [
        {
          blockType: "hero",
          title: "Websites die sneller live gaan",
          subtitle:
            "HisarWeb Starter combineert setup, CMS en een schaalbare frontend in één productbasis.",
          ctaText: "Plan een demo",
          ctaLink: "/contact",
        },
        {
          blockType: "features",
          title: "Waarom teams hiermee starten",
          features: [
            {
              title: "Snelle onboarding",
              description: "Setup wizard, demo-content en runtime settings versnellen eerste validatie.",
            },
            {
              title: "CMS-ready structuur",
              description: "Gebruik Payload blocks en fallback content zonder direct afhankelijk te zijn van een live database.",
            },
            {
              title: "Deploy-ready basis",
              description: "Werk met Docker, CI en production-like Playwright validatie vanaf dag één.",
            },
          ],
        },
      ],
    },
    {
      title: "Home",
      slug: "home",
      locale: "en",
      summary: "A homepage that immediately communicates product value, positioning and next actions.",
      content:
        "Use this starter to move from positioning to a live site quickly, with setup, content blocks and operational visibility in one foundation.",
      blocks: [
        {
          blockType: "hero",
          title: "Websites that launch faster",
          subtitle:
            "HisarWeb Starter combines setup, CMS and a scalable frontend into one product foundation.",
          ctaText: "Book a demo",
          ctaLink: "/contact",
        },
        {
          blockType: "features",
          title: "Why teams start here",
          features: [
            {
              title: "Faster onboarding",
              description: "Setup wizard, demo content and runtime settings speed up first validation.",
            },
            {
              title: "CMS-ready structure",
              description: "Use Payload blocks and fallback content without depending on a live database immediately.",
            },
            {
              title: "Deploy-ready foundation",
              description: "Work with Docker, CI and production-like Playwright validation from day one.",
            },
          ],
        },
      ],
    },
    {
      title: "Over HisarWeb Starter",
      slug: "about",
      locale: "nl",
      summary: "Deze pagina laat zien hoe de starter ingezet kan worden voor branding, leadgeneratie en operationele overdracht.",
      content:
        "HisarWeb Starter is ontworpen om agencies en productteams een consistente basis te geven voor meertalige websites, onboarding en CMS-gedreven uitbreidingen.",
    },
    {
      title: "About HisarWeb Starter",
      slug: "about",
      locale: "en",
      summary: "This page shows how the starter can support branding, lead generation and operational handoff.",
      content:
        "HisarWeb Starter is designed to give agencies and product teams a consistent base for multilingual websites, onboarding and CMS-driven extensions.",
    },
    {
      title: "Diensten",
      slug: "services",
      locale: "nl",
      summary: "Gebruik de servicestructuur om aanbod, expertise en waardeproposities helder te tonen.",
      content:
        "Toon aanbod per business type.\nGebruik featured services voor focus.\nKoppel later pricing en CTA’s per dienst.",
    },
    {
      title: "Services",
      slug: "services",
      locale: "en",
      summary: "Use the services structure to present offers, expertise and value propositions clearly.",
      content:
        "Show offers per business type.\nUse featured services for focus.\nConnect pricing and CTAs per service later.",
    },
    {
      title: "Portfolio",
      slug: "portfolio",
      locale: "nl",
      summary: "Een plek om cases, resultaten en bewijs van uitvoering te tonen.",
      content:
        "Gebruik portfolio-items om social proof op te bouwen en te laten zien hoe branding, content en techniek samenkomen.",
    },
    {
      title: "Portfolio",
      slug: "portfolio",
      locale: "en",
      summary: "A place to showcase case studies, outcomes and proof of execution.",
      content:
        "Use portfolio items to build social proof and show how branding, content and engineering work together.",
    },
    {
      title: "Prijzen",
      slug: "pricing",
      locale: "nl",
      summary: "Voorbeeldstructuur voor prijscommunicatie en commerciële scenario’s.",
      content:
        "De pricingpagina bevat voorbeeldstructuur om tijdens demo’s snel commerciële scenario’s te tonen.\n\nDit helpt zowel sales als product om alignment te houden rond positionering en waardeperceptie.",
    },
    {
      title: "Pricing",
      slug: "pricing",
      locale: "en",
      summary: "Sample structure for price communication and commercial scenarios.",
      content:
        "The pricing page provides a sample structure to demonstrate commercial scenarios quickly during walkthroughs.\n\nThis helps both sales and product maintain alignment around positioning and value perception.",
    },
    {
      title: "Veelgestelde vragen",
      slug: "faq",
      locale: "nl",
      summary: "FAQ-structuur voor intakevragen, bezwaren en implementatieverwachtingen.",
      content:
        "Bundel praktische vragen over onboarding, contentmigratie en deployment in één beheersbare structuur.",
    },
    {
      title: "Frequently asked questions",
      slug: "faq",
      locale: "en",
      summary: "FAQ structure for intake questions, objections and implementation expectations.",
      content:
        "Collect practical questions about onboarding, content migration and deployment in one manageable structure.",
    },
    {
      title: "Contact",
      slug: "contact",
      locale: "nl",
      summary: "Laat bezoekers eenvoudig hun project, vraag of demo-aanvraag indienen.",
      content:
        "De contactflow vormt een directe brug tussen marketing, intake en opvolging — met lokale fallback persistence voor snelle validatie.",
    },
    {
      title: "Contact",
      slug: "contact",
      locale: "en",
      summary: "Let visitors easily submit a project inquiry, question or demo request.",
      content:
        "The contact flow creates a direct bridge between marketing, intake and follow-up, with local fallback persistence for fast validation.",
    },
  ],
  posts: [
    {
      title: "Van snelle setup naar consistente delivery",
      slug: "snelle-setup-consistente-delivery",
      excerpt: "Hoe demo-content, setup flows en CMS-structuur samen de eerste release versnellen.",
      content:
        "Teams willen snel naar een eerste demo of liveversie. Deze starter geeft daarom meteen een setup wizard, contentbasis en deploybare structuur.",
      publishedAt: "2026-03-11T09:00:00.000Z",
    },
    {
      title: "From fast setup to reliable delivery",
      slug: "fast-setup-reliable-delivery",
      excerpt: "How demo content, setup flows and CMS structure shorten the path to a first release.",
      content:
        "Teams want to reach a first demo or live version quickly. That is why this starter includes a setup wizard, content foundation and deployable structure from the start.",
      publishedAt: "2026-03-11T09:30:00.000Z",
    },
  ],
  services: [
    {
      title: "Website foundations",
      slug: "website-foundations",
      summary: "Meertalige websitebasis met onboarding, CMS en deploymentpaden.",
      featured: true,
    },
    {
      title: "Content operations",
      slug: "content-operations",
      summary: "Structuren voor pagina’s, FAQ, services en blogcontent met fallback-veiligheid.",
      featured: true,
    },
    {
      title: "Growth enablement",
      slug: "growth-enablement",
      summary: "Analytics, experimenten en intakeflows om commerciële validatie te ondersteunen.",
      featured: false,
    },
  ],
  portfolio: [
    {
      title: "Starter rollout for a local service brand",
      slug: "starter-rollout-local-service-brand",
      summary: "Voorbeeldcase waarin pricing, services en contactflows samen een verkoopverhaal vormen.",
    },
    {
      title: "Multilingual launch pad for an agency team",
      slug: "multilingual-launch-pad-agency-team",
      summary: "Voorbeeldcase waarin onboarding, contentbeheer en demo-ready delivery centraal staan.",
    },
  ],
  faq: [
    {
      question: "Werkt de starter ook zonder database?",
      answer:
        "Ja. De belangrijkste flows gebruiken JSON/file fallbacks zodat je lokaal kunt valideren zonder meteen afhankelijk te zijn van een actieve database.",
      category: "setup",
    },
    {
      question: "Can we start with demo content first?",
      answer:
        "Yes. The seed flow writes local fallback content first and only attempts database or Payload writes when those integrations are available.",
      category: "content",
    },
    {
      question: "How production-like is the local validation path?",
      answer:
        "Playwright runs against the standalone server wrapper, which is closer to production than using next dev in this Windows environment.",
      category: "deployment",
    },
  ],
  settings: [
    {
      key: "homepageContent",
      group: "marketing",
      value: JSON.stringify({
        nl: {
          title: "Websites die sneller live gaan",
          description:
            "Combineer onboarding, CMS, analytics en experimenteerbaarheid in één productbasis.",
          primaryCtaLabel: "Start je traject",
          primaryCtaHref: "/contact",
          secondaryCtaLabel: "Bekijk diensten",
          secondaryCtaHref: "/services",
          featuresTitle: "Waarom teams hiermee sneller leveren",
          features: [
            {
              title: "Snelle validatie",
              description: "Gebruik demo-content en setup flows om al vroeg een overtuigende demo neer te zetten.",
            },
            {
              title: "Content-first uitbreidbaar",
              description: "Werk met CMS content, locale routing en runtime fallbacks zonder de basis te breken.",
            },
            {
              title: "Operatieklaar",
              description: "Gebruik dashboard, E2E checks en deploypaden voor een professionele handoff.",
            },
          ],
          testimonialsTitle: "Wat teams hier direct mee winnen",
          testimonials: [
            {
              quote: "We konden binnen één sprint van concept naar echte demo.",
              author: "Demo team",
              role: "Agency ops",
            },
            {
              quote: "De combinatie van fallback content en CMS-structuur scheelde ons weken afstemming.",
              author: "Product owner",
              role: "Digital delivery",
            },
          ],
          ctaTitle: "Klaar om je volgende site sneller te lanceren?",
          ctaDescription:
            "Gebruik deze basis om branding, setup en contentproductie direct op één lijn te krijgen.",
          ctaLabel: "Plan een intake",
          ctaHref: "/contact",
        },
        en: {
          title: "Websites that launch faster",
          description:
            "Combine onboarding, CMS, analytics and experimentation in one product foundation.",
          primaryCtaLabel: "Start your project",
          primaryCtaHref: "/contact",
          secondaryCtaLabel: "View services",
          secondaryCtaHref: "/services",
          featuresTitle: "Why teams deliver faster with this starter",
          features: [
            {
              title: "Faster validation",
              description: "Use demo content and setup flows to create a convincing demo early.",
            },
            {
              title: "Content-first extensibility",
              description: "Work with CMS content, locale routing and runtime fallbacks without breaking the foundation.",
            },
            {
              title: "Operations-ready",
              description: "Use the dashboard, E2E checks and deployment paths for a professional handoff.",
            },
          ],
          testimonialsTitle: "What teams gain immediately",
          testimonials: [
            {
              quote: "We moved from concept to a real demo within a single sprint.",
              author: "Demo team",
              role: "Agency ops",
            },
            {
              quote: "The combination of fallback content and CMS structure saved us weeks of alignment.",
              author: "Product owner",
              role: "Digital delivery",
            },
          ],
          ctaTitle: "Ready to launch your next site faster?",
          ctaDescription:
            "Use this foundation to align branding, setup and content production from the start.",
          ctaLabel: "Book an intake",
          ctaHref: "/contact",
        },
      }),
    },
  ],
}
