export type BillingPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SubscriptionCategory =
  | 'services'
  | 'entertainment'
  | 'utilities'
  | 'education'
  | 'other';
export type SubscriptionStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  price: number;
  category: SubscriptionCategory;
  billingPeriod: BillingPeriod;
  nextPaymentDate: string;
  status: SubscriptionStatus;
  notifyBeforeDays: number;
}

export interface CategoryLimit {
  id: string;
  userId: string;
  category: SubscriptionCategory;
  monthlyLimit: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  subscriptionId: string;
  message: string;
  isRead: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface CreateSubscriptionDto {
  name: string;
  price: number;
  category: SubscriptionCategory;
  billingPeriod: BillingPeriod;
  nextPaymentDate: string;
  status: SubscriptionStatus;
  notifyBeforeDays: number;
}

export interface SubscriptionFilters {
  category: SubscriptionCategory | 'all';
  status: SubscriptionStatus | 'all';
}

export type SubscriptionSort = 'nextPaymentDate' | 'price';

export const SUBSCRIPTION_CATEGORIES: readonly SubscriptionCategory[] = [
  'services',
  'entertainment',
  'utilities',
  'education',
  'other'
] as const;

export const BILLING_PERIODS: readonly BillingPeriod[] = [
  'daily',
  'weekly',
  'monthly',
  'yearly'
] as const;
