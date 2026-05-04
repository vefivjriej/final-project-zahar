import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, isObservable, Observable } from 'rxjs';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            auth: {
              session: null,
              loading: false,
              error: null
            }
          }
        }),
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn((commands: string[]) => ({ commands }) as unknown as UrlTree)
          }
        }
      ]
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
  });

  it('redirects anonymous user to login', async () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(isObservable(result)).toBe(true);
    await expect(firstValueFrom(result as Observable<boolean | UrlTree>)).resolves.toEqual({
      commands: ['/auth/login']
    });
  });

  it('allows authenticated user', async () => {
    store.setState({
      auth: {
        session: {
          token: 'token',
          user: {
            id: 'u_1',
            email: 'demo@example.com'
          }
        },
        loading: false,
        error: null
      }
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    await expect(firstValueFrom(result as Observable<boolean | UrlTree>)).resolves.toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
