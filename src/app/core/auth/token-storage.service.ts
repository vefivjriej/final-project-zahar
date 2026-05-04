import { Injectable } from '@angular/core';
import { AuthSession } from '@shared/models/domain.models';

const SESSION_KEY = 'spm.session';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  getSession(): AuthSession | null {
    const rawSession = localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      this.clear();

      return null;
    }
  }

  saveSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
