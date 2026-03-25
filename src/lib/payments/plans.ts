import type { Plan } from "./types"

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    currency: "EUR",
    interval: "month",
    features: [
      "5 pagina's",
      "1 teamlid",
      "Basis analytics",
      "Community support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    currency: "EUR",
    interval: "month",
    features: [
      "Onbeperkt pagina's",
      "5 teamleden",
      "Geavanceerde analytics",
      "Priority support",
      "Custom domein",
      "API toegang",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    currency: "EUR",
    interval: "month",
    features: [
      "Alles in Professional",
      "Onbeperkt teamleden",
      "SSO / SAML",
      "Dedicated support",
      "SLA",
      "White-label",
      "Webhook integraties",
    ],
  },
]

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id)
}
