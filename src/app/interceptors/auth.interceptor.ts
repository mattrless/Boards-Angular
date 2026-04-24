import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtTokenService } from '../services/jwt-token.service';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtTokenService = inject(JwtTokenService);
  const token = jwtTokenService.getToken();

  const baseApiUrl = environment.boardsApiUrl;
  const url = new URL(req.url, baseApiUrl);
  const pathname = url.pathname;
  // public routes
  const isLoginRoute = req.method === 'POST' && pathname === '/auth/login';
  const isRegisterRoute = req.method === 'POST' && pathname === '/users';

  if (!token || isLoginRoute || isRegisterRoute) {
    return next(req);
  }
  // add authorization in private routes
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
