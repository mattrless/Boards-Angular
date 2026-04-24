import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const token = inject(JwtTokenService).getToken();
  const router = inject(Router);

  if (!token) return true;

  const returnUrl = route.queryParamMap.get('returnUrl');

  if (returnUrl && returnUrl.startsWith('/')) {
    return router.parseUrl(returnUrl);
  }

  return router.createUrlTree(['/boards']);
};
