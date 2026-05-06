import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthSessionService);
  const jwt = inject(JwtTokenService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  const token = jwt.getToken();

  if (token) {
    try {
      await firstValueFrom(auth.loadSession());
      return true;
    } catch {
      return router.createUrlTree(['/'], {
        queryParams: { returnUrl: state.url }
      });
    }
  }

  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
