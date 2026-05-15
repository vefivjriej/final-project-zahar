import { CategoryLimit, Subscription } from '@shared/models/domain.models';

import {
  buildDueNotifications,
  exceededLimits,
  expensesByCategory,
  monthlyCost,
  totalMonthlyCost,
  upcomingPayments
} from './subscription-calculations';

const baseSubscription: Subscription = {
  id: 's_1',
  userId: 'u_1',
  name: 'Service',
  price: 12,
  category: 'services',
  billingPeriod: 'monthly',
  nextPaymentDate: '2026-05-01',
  status: 'active',
  notifyBeforeDays: 3
};

describe('subscription calculations', () => {
  it('calculates monthly cost for monthly subscriptions', () => {
    expect(monthlyCost(baseSubscription)).toBe(12);
  });

  it('calculates monthly cost for yearly subscriptions', () => {
    expect(monthlyCost({ ...baseSubscription, billingPeriod: 'yearly', price: 120 })).toBe(10);
  });

  it('calculates monthly cost for weekly subscriptions', () => {
    expect(monthlyCost({ ...baseSubscription, billingPeriod: 'weekly', price: 6 })).toBe(26);
  });

  it('ignores inactive subscriptions in monthly cost', () => {
    expect(monthlyCost({ ...baseSubscription, status: 'inactive' })).toBe(0);
  });

  it('calculates total monthly cost', () => {
    const subscriptions = [
      baseSubscription,
      { ...baseSubscription, id: 's_2', billingPeriod: 'yearly', price: 120 }
    ];

    expect(totalMonthlyCost(subscriptions)).toBe(22);
  });

  it('aggregates expenses by category', () => {
    const subscriptions = [
      baseSubscription,
      { ...baseSubscription, id: 's_2', category: 'education', billingPeriod: 'yearly', price: 120 }
    ];

    expect(expensesByCategory(subscriptions)).toEqual({
      services: 12,
      entertainment: 0,
      utilities: 0,
      education: 10,
      other: 0
    });
  });

  it('returns upcoming payments for the next range', () => {
    const result = upcomingPayments(
      [baseSubscription, { ...baseSubscription, id: 's_2', nextPaymentDate: '2026-06-15' }],
      new Date(2026, 3, 25),
      10
    );

    expect(result.map((subscription) => subscription.id)).toEqual(['s_1']);
  });

  it('detects exceeded category limits', () => {
    const limits: CategoryLimit[] = [
      { id: 'l_1', userId: 'u_1', category: 'services', monthlyLimit: 10 }
    ];

    expect(exceededLimits([baseSubscription], limits)).toEqual(limits);
  });

  it('builds due notifications', () => {
    const notifications = buildDueNotifications([baseSubscription], 'u_1', new Date(2026, 3, 29));

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({
      userId: 'u_1',
      subscriptionId: 's_1',
      isRead: false
    });
  });

  it('does not build notifications for inactive subscriptions', () => {
    const notifications = buildDueNotifications(
      [{ ...baseSubscription, status: 'inactive' }],
      'u_1',
      new Date(2026, 3, 29)
    );

    expect(notifications).toHaveLength(0);
  });
});
