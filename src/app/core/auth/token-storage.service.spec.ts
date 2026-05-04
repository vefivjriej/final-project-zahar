import { TestBed } from '@angular/core/testing';

import { AuthSession } from '@shared/models/domain.models';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
  const session: AuthSession = {
    token: 'token',
    user: {
      id: 'u_1',
      email: 'demo@example.com'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  it('saves and reads session', () => {
    service.saveSession(session);

    expect(service.getSession()).toEqual(session);
  });

  it('returns token from session', () => {
    service.saveSession(session);

    expect(service.getToken()).toBe('token');
  });

  it('clears session', () => {
    service.saveSession(session);
    service.clear();

    expect(service.getSession()).toBeNull();
  });

  it('clears malformed session', () => {
    localStorage.setItem('spm.session', '{broken');

    expect(service.getSession()).toBeNull();
    expect(localStorage.getItem('spm.session')).toBeNull();
  });
});
