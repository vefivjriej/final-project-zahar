import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import {
  CreateSubscriptionDto,
  Subscription,
  SubscriptionStatus
} from '@shared/models/domain.models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsApiService {
  private readonly api = inject(ApiService);

  list(userId: string): Observable<Subscription[]> {
    return this.api.get<Subscription[]>('/subscriptions', { userId });
  }

  create(userId: string, dto: CreateSubscriptionDto): Observable<Subscription> {
    return this.api.post<CreateSubscriptionDto & { id: string; userId: string }, Subscription>(
      '/subscriptions',
      {
        id: crypto.randomUUID(),
        userId,
        ...dto
      }
    );
  }

  update(subscription: Subscription): Observable<Subscription> {
    return this.api.put<Subscription, Subscription>(`/subscriptions/${subscription.id}`, subscription);
  }

  updateStatus(subscription: Subscription, status: SubscriptionStatus): Observable<Subscription> {
    return this.api.patch<Pick<Subscription, 'status'>, Subscription>(
      `/subscriptions/${subscription.id}`,
      { status }
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/subscriptions/${id}`);
  }
}
