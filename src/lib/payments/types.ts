export type PlanId = "starter" | "professional" | "enterprise"

export type Plan = {
  id: PlanId
  name: string
  price: number
  currency: string
  interval: "month" | "year"
  features: string[]
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"

export type Subscription = {
  id: string
  planId: PlanId
  status: SubscriptionStatus
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export type CheckoutSession = {
  url: string
  sessionId: string
}

export type PaymentProvider = {
  createCheckoutSession(params: {
    planId: PlanId
    organizationId: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutSession>

  createPortalSession(params: {
    organizationId: string
    returnUrl: string
  }): Promise<{ url: string }>

  getSubscription(organizationId: string): Promise<Subscription | null>

  handleWebhook(payload: string, signature: string): Promise<void>
}
