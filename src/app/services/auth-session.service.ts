import { computed, inject, Injectable, signal } from '@angular/core';
import { MeResponseDto } from '../api/generated/model';
import { UsersService } from '../api/generated/users/users.service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly userService = inject(UsersService);

  readonly user = signal<MeResponseDto | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());

  loadSession() {
    return this.userService.findMe().pipe(
      tap((res) => this.user.set(res)),
      catchError((error) => {
        this.user.set(null);
        return throwError(() => error);
      })
    );
  }

  clearSession() {
    this.user.set(null);
  }

  hasRole(role: string): boolean {
    if (!this.isAuthenticated()) return false;
    return this.user()?.systemRole?.name === role;
  }

  hasPermission(permission: string): boolean {
    if (!this.isAuthenticated()) return false;
    return !!this.user()?.permissions?.includes(permission);
  }
}
