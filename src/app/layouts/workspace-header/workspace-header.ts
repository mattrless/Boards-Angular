import { AuthSessionService } from './../../services/auth-session.service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { JwtTokenService } from '../../services/jwt-token.service';
import type { Breadcrumb } from './interfaces/Breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
  selector: 'workspace-header',
  imports: [RouterOutlet, HlmButtonImports, HlmBreadcrumbImports],
  templateUrl: './workspace-header.html',
})
export default class WorkspaceHeader {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly jwtTokenService = inject(JwtTokenService);

  private router = inject(Router);

  // readonly breadcrumbs = signal<Breadcrumb[]>([]);

  readonly userName = computed(() => this.authSessionService.user()?.profile?.name);
  readonly isLoggingOut = signal(false);

  async onLogoutClick() {
    this.isLoggingOut.set(true);
    try {
      this.authSessionService.clearSession();
      this.jwtTokenService.clearToken();
      await this.router.navigate(['/']);
    } finally {
      this.isLoggingOut.set(false);
    }
  }


}
