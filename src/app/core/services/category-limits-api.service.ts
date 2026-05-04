import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import { CategoryLimit, SubscriptionCategory } from '@shared/models/domain.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryLimitsApiService {
  private readonly api = inject(ApiService);

  list(userId: string): Observable<CategoryLimit[]> {
    return this.api.get<CategoryLimit[]>('/category-limits', { userId });
  }

  upsert(
    userId: string,
    existing: CategoryLimit | undefined,
    category: SubscriptionCategory,
    monthlyLimit: number
  ): Observable<CategoryLimit> {
    if (existing) {
      return this.api.put<CategoryLimit, CategoryLimit>(`/category-limits/${existing.id}`, {
        ...existing,
        monthlyLimit
      });
    }

    return this.api.post<CategoryLimit, CategoryLimit>('/category-limits', {
      id: crypto.randomUUID(),
      userId,
      category,
      monthlyLimit
    });
  }
}
