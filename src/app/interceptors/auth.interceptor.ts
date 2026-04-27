import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtTokenService } from '../services/jwt-token.service';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';
import { AuthSessionService } from '../services/auth-session.service';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtTokenService = inject(JwtTokenService);
  const token = jwtTokenService.getToken();
  const authSessionService = inject(AuthSessionService);
  const router = inject(Router);

  const baseApiUrl = environment.boardsApiUrl;
  const url = new URL(req.url, baseApiUrl);
  const pathname = url.pathname;
  // public routes
  const isLoginRoute = req.method === 'POST' && pathname === '/auth/login';
  const isRegisterRoute = req.method === 'POST' && pathname === '/users';
  const isPublicRoute = isLoginRoute || isRegisterRoute;
  // set token in private routes
  const authReq = token && !isPublicRoute
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  // continue in public routes
  if (!token || isLoginRoute || isRegisterRoute) {
    return next(req);
  }
  // handle 401 errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicRoute) {
        jwtTokenService.clearToken();
        authSessionService.clearSession();

        toast.error("Unauthorized");
        void router.navigate(['/'], { queryParams: { returnUrl: router.url } });
      }
      // return error in public routes, such as login, to handle it
      return throwError(() => error);
    })
  );
};
