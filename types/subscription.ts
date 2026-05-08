export interface SubscriptionCheck extends SubscriptionStatus {
  canProceed: boolean;
  error?: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  isBillingManaged?: boolean;
  requestsUsed: number;
  requestsRemaining: number;
}
