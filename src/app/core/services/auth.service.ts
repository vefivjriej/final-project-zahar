import { Injectable, inject } from '@angular/core';
import { map, Observable, tap, throwError } from 'rxjs';

import { TokenStorageService } from '@core/auth/token-storage.service';
import { ApiService } from '@core/services/api.service';
import { AuthSession, Credentials, User } from '@shared/models/domain.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenStorage = inject(TokenStorageService);

  login(credentials: Credentials): Observable<AuthSession> {
    return this.api
      .get<User[]>('/users', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      })
      .pipe(
        map((users) => {
          const user = users.at(0);

          if (!user) {
            throw new Error('Неверный email или пароль');
          }

          return {
            token: this.createToken(user.id),
            user: {
              id: user.id,
              email: user.email
            }
          };
        }),
        tap((session) => this.tokenStorage.saveSession(session))
      );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  requireSession(): AuthSession {
    const session = this.tokenStorage.getSession();

    if (!session) {
      throw new Error('Пользователь не авторизован');
    }

    return session;
  }

  handleAuthError(error: unknown): Observable<never> {
    const message = error instanceof Error ? error.message : 'Ошибка авторизации';

    return throwError(() => new Error(message));
  }

  private createToken(userId: string): string {
    return btoa(JSON.stringify({ userId, issuedAt: Date.now() }));
  }
}
