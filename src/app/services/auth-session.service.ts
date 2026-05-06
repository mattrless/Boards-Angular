import { computed, inject, Injectable, signal } from '@angular/core';
import { MeResponseDto } from '../api/generated/model';
import { UsersService } from '../api/generated/users/users.service';
import { catchError, EMPTY, tap, throwError } from 'rxjs';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly userService = inject(UsersService);
  private readonly jwt = inject(JwtTokenService);

  readonly user = signal<MeResponseDto | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isLoading = signal(false);

  loadSession() {
    if (this.isLoading()) return EMPTY;

    this.isLoading.set(true);

    return this.userService.findMe().pipe(
      tap((res) => {
        this.user.set(res);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.clearSession();
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  clearSession() {
    this.user.set(null);
    this.jwt.clearToken();
  }

  hasRole(role: string): boolean {
    return this.user()?.systemRole?.name === role;
  }

  hasPermission(permission: string): boolean {
    return !!this.user()?.permissions?.includes(permission);
  }
}
