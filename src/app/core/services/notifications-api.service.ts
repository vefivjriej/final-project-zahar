import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import { AppNotification } from '@shared/models/domain.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApiService {
  private readonly api = inject(ApiService);

  list(userId: string): Observable<AppNotification[]> {
    return this.api.get<AppNotification[]>('/notifications', { userId });
  }

  create(notification: AppNotification): Observable<AppNotification> {
    return this.api.post<AppNotification, AppNotification>('/notifications', notification);
  }

  markRead(notification: AppNotification): Observable<AppNotification> {
    return this.api.patch<Pick<AppNotification, 'isRead'>, AppNotification>(
      `/notifications/${notification.id}`,
      { isRead: true }
    );
  }
}
