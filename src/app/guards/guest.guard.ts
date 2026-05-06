import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

export const guestGuard: CanActivateFn = (route) => {
  const auth = inject(AuthSessionService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  const returnUrl = route.queryParamMap.get('returnUrl');

  if (returnUrl?.startsWith('/')) {
    return router.parseUrl(returnUrl);
  }

  return router.createUrlTree(['/boards']);
};
