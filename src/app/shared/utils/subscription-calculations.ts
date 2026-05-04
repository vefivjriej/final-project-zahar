import {
  AppNotification,
  CategoryLimit,
  Subscription,
  SubscriptionCategory
} from '@shared/models/domain.models';

const MONTHS_IN_YEAR = 12;
const AVERAGE_DAYS_IN_MONTH = 30;
const WEEKS_IN_YEAR = 52;

export function monthlyCost(subscription: Subscription): number {
  if (subscription.status === 'inactive') {
    return 0;
  }

  switch (subscription.billingPeriod) {
    case 'daily':
      return subscription.price * AVERAGE_DAYS_IN_MONTH;
    case 'weekly':
      return (subscription.price * WEEKS_IN_YEAR) / MONTHS_IN_YEAR;
    case 'monthly':
      return subscription.price;
    case 'yearly':
      return subscription.price / MONTHS_IN_YEAR;
  }
}

export function totalMonthlyCost(subscriptions: readonly Subscription[]): number {
  return roundMoney(subscriptions.reduce((total, subscription) => total + monthlyCost(subscription), 0));
}

export function expensesByCategory(
  subscriptions: readonly Subscription[]
): Record<SubscriptionCategory, number> {
  return subscriptions.reduce<Record<SubscriptionCategory, number>>(
    (accumulator, subscription) => {
      accumulator[subscription.category] = roundMoney(
        accumulator[subscription.category] + monthlyCost(subscription)
      );

      return accumulator;
    },
    {
      services: 0,
      entertainment: 0,
      utilities: 0,
      education: 0,
      other: 0
    }
  );
}

export function upcomingPayments(
  subscriptions: readonly Subscription[],
  today: Date = new Date(),
  daysAhead = 14
): Subscription[] {
  const todayStart = stripTime(today).getTime();
  const rangeEnd = todayStart + daysAhead * 24 * 60 * 60 * 1000;

  return subscriptions
    .filter((subscription) => subscription.status === 'active')
    .filter((subscription) => {
      const paymentDate = parseLocalDate(subscription.nextPaymentDate).getTime();

      return paymentDate >= todayStart && paymentDate <= rangeEnd;
    })
    .sort((left, right) => left.nextPaymentDate.localeCompare(right.nextPaymentDate));
}

export function exceededLimits(
  subscriptions: readonly Subscription[],
  limits: readonly CategoryLimit[]
): CategoryLimit[] {
  const spending = expensesByCategory(subscriptions);

  return limits.filter((limit) => spending[limit.category] > limit.monthlyLimit);
}

export function buildDueNotifications(
  subscriptions: readonly Subscription[],
  userId: string,
  today: Date = new Date()
): AppNotification[] {
  const todayStart = stripTime(today).getTime();

  return subscriptions
    .filter((subscription) => subscription.status === 'active')
    .filter((subscription) => {
      const notificationDate =
        parseLocalDate(subscription.nextPaymentDate).getTime() -
        subscription.notifyBeforeDays * 24 * 60 * 60 * 1000;

      return notificationDate <= todayStart;
    })
    .map((subscription) => ({
      id: crypto.randomUUID(),
      userId,
      subscriptionId: subscription.id,
      message: `${subscription.name} будет списан ${subscription.nextPaymentDate}`,
      isRead: false
    }));
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function stripTime(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}
