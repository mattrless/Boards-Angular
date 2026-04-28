import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthSessionService } from './services/auth-session.service';
import { JwtTokenService } from './services/jwt-token.service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
      ])
    ),
    provideAppInitializer(async () => {
      const authSessionService = inject(AuthSessionService);
      const jwtTokenService = inject(JwtTokenService);
      const token = jwtTokenService.getToken();

      if (!token) return;

      try {
        await firstValueFrom(authSessionService.loadSession());
      } catch {
        jwtTokenService.clearToken();
        authSessionService.clearSession();
      }
    })

  ],
};
