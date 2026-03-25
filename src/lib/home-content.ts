export type HomeFeatureItem = {
  title: string
  description: string
  body: string
}

export type HomeTestimonialItem = {
  quote: string
  author: string
  role: string
  body: string
}

export type RuntimeHomeContent = {
  badge: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
  stats: {
    modulesLabel: string
    languagesLabel: string
    deliveryLabel: string
  }
  features: {
    title: string
    description: string
    items: HomeFeatureItem[]
  }
  testimonials: {
    title: string
    description: string
    items: HomeTestimonialItem[]
  }
  cta: {
    title: string
    description: string
    primary: string
    secondary: string
  }
}

export const defaultHomeContent: Record<string, RuntimeHomeContent> = {
  nl: {
    badge: "Top expert team actief",
    title: "Een website starter kit die WordPress-gemak combineert met Next.js 15 power.",
    description:
      "We bouwen een branded, meertalige basis waarmee HisarWeb sneller kan leveren, consistenter kan deployen en clients later veilig kan laten updaten.",
    primaryCta: "Start setup flow",
    secondaryCta: "Bekijk planning",
    stats: {
      modulesLabel: "modules",
      languagesLabel: "talen",
      deliveryLabel: "productflow",
    },
    features: {
      title: "Waarom deze basis telt",
      description:
        "De huidige sprint focust op schaalbare fundamenten zodat frontend, backend en operations parallel verder kunnen.",
      items: [
        {
          title: "Setup wizard-first",
          description:
            "De productflow start bij een begeleide configuratie in plaats van losse handmatige setupstappen.",
          body:
            "Deze module hoort bij de kern van de starter en helpt sales, onboarding en delivery sneller op één lijn te brengen.",
        },
        {
          title: "NL + EN vanaf dag één",
          description:
            "Route- en contentstructuur zijn van bij de start voorzien op meertalige levering.",
          body:
            "Door lokalisatie vroeg te positioneren, blijft elke volgende sprint klaar voor bredere internationale uitbreiding.",
        },
        {
          title: "Payload-ready backend",
          description:
            "Collections, globals en helpermodules worden als veilige skeleton neergezet voor de volgende sprint.",
          body:
            "Hiermee wordt CMS-driven rendering stapsgewijs mogelijk zonder de no-data fallback flows te breken.",
        },
        {
          title: "Delivery hygiene",
          description:
            "README, env-variabelen, backlog en projectstructuur worden voorbereid voor teamwerk en deployment.",
          body:
            "Dit verlaagt risico bij deployments en maakt autonome uitvoering over meerdere sprints realistischer.",
        },
      ],
    },
    testimonials: {
      title: "Doel van deze sprint",
      description:
        "Geen losse demo, maar een basis waarop het productteam gecontroleerd kan verderbouwen.",
      items: [
        {
          quote:
            "We vervangen template-chaos door een productfundament dat sneller te verkopen en te onderhouden is.",
          author: "Product Owner",
          role: "HisarWeb",
          body: "Sprintresultaten worden telkens afgewogen op verkoopbaarheid, onderhoudbaarheid en herbruikbaarheid.",
        },
        {
          quote:
            "Door i18n, backend skeleton en documentatie vroeg te zetten, vermijden we dure rework in latere sprints.",
          author: "Lead Engineer",
          role: "Platform",
          body: "De focus ligt op fundamenten die volgende iteraties versnellen in plaats van tijdelijke demo-oplossingen.",
        },
        {
          quote:
            "Deze basis is gemaakt om meerdere klanteninstanties consistent te lanceren en later te updaten.",
          author: "Delivery Lead",
          role: "Operations",
          body: "Door standaarden nu goed te leggen, daalt de frictie in onboarding, support en releasebeheer later.",
        },
      ],
    },
    cta: {
      title: "Klaar om van starter naar product te gaan",
      description:
        "De volgende sprint kan nu veilig focussen op echte Payload-integratie, auth-wiring en de multi-step setup wizard.",
      primary: "Bekijk setup",
      secondary: "Contacteer HisarWeb",
    },
  },
  en: {
    badge: "Top expert team active",
    title: "A website starter kit that blends WordPress simplicity with Next.js 15 power.",
    description:
      "We are building a branded multilingual foundation that lets HisarWeb ship faster, deploy more consistently and keep client instances upgradeable later on.",
    primaryCta: "Start setup flow",
    secondaryCta: "View roadmap",
    stats: {
      modulesLabel: "modules",
      languagesLabel: "languages",
      deliveryLabel: "delivery flow",
    },
    features: {
      title: "Why this foundation matters",
      description:
        "The current sprint focuses on scalable building blocks so frontend, backend and operations can keep moving in parallel.",
      items: [
        {
          title: "Setup wizard-first",
          description:
            "The product flow starts with guided configuration instead of scattered manual setup steps.",
          body:
            "This module sits at the heart of the starter and helps sales, onboarding and delivery align faster.",
        },
        {
          title: "NL + EN from day one",
          description:
            "Routing and content structure are multilingual from the start instead of being retrofitted later.",
          body:
            "By placing localization early, every following sprint stays ready for broader international expansion.",
        },
        {
          title: "Payload-ready backend",
          description:
            "Collections, globals and helper modules are introduced as safe skeletons for the next sprint.",
          body:
            "This makes CMS-driven rendering possible step by step without breaking the no-data fallback flows.",
        },
        {
          title: "Delivery hygiene",
          description:
            "README, environment variables, backlog and project structure are prepared for team execution and deployment.",
          body:
            "That lowers deployment risk and makes long autonomous execution across multiple sprints more realistic.",
        },
      ],
    },
    testimonials: {
      title: "Sprint outcome",
      description:
        "Not a throwaway demo, but a foundation the product team can extend with confidence.",
      items: [
        {
          quote:
            "We are replacing template chaos with a product baseline that is faster to sell and easier to maintain.",
          author: "Product Owner",
          role: "HisarWeb",
          body: "Each sprint outcome is weighed against sellability, maintainability and reuse.",
        },
        {
          quote:
            "By placing i18n, backend skeletons and docs early, we avoid expensive rework in later sprints.",
          author: "Lead Engineer",
          role: "Platform",
          body: "The focus stays on foundations that accelerate later iterations instead of temporary demo fixes.",
        },
        {
          quote:
            "This foundation is designed to launch multiple client instances consistently and update them safely later on.",
          author: "Delivery Lead",
          role: "Operations",
          body: "By standardizing now, the team reduces friction in onboarding, support and release management later.",
        },
      ],
    },
    cta: {
      title: "Ready to move from starter to product",
      description:
        "The next sprint can now focus safely on real Payload integration, auth wiring and the multi-step setup wizard.",
      primary: "View setup",
      secondary: "Contact HisarWeb",
    },
  },
}
