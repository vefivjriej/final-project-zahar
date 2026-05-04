import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { selectIsAuthenticated } from '@store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => isAuthenticated || router.createUrlTree(['/auth/login']))
  );
};
