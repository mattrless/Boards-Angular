import { inject } from '@angular/core';
import { JwtTokenService } from './../services/jwt-token.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);
  const token = jwtTokenService.getToken();

  if (token) return true;
  // return to auth forms in case not token found
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
