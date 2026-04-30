import { BoardPermissionsService } from './../../services/board-permissions.service';
import { BoardsStateService } from './../../services/boards-state.service';
import { AuthSessionService } from './../../services/auth-session.service';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { JwtTokenService } from '../../services/jwt-token.service';
import type { Breadcrumb } from './interfaces/Breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { BoardResponseDto } from '../../api/generated/model';
import { filter } from 'rxjs';

@Component({
  selector: 'workspace-header',
  imports: [RouterOutlet, HlmButtonImports, HlmBreadcrumbImports, RouterLink],
  templateUrl: './workspace-header.html',
})
export default class WorkspaceHeader {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly jwtTokenService = inject(JwtTokenService);
  private readonly boardsStateService = inject(BoardsStateService);
  private readonly boardPermissionsService = inject(BoardPermissionsService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly board = signal<BoardResponseDto | undefined>(undefined);
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  readonly userName = computed(() => this.authSessionService.user()?.profile?.name);
  readonly isLoggingOut = signal(false);

  async onLogoutClick() {
    this.isLoggingOut.set(true);
    try {
      this.authSessionService.clearSession();
      this.jwtTokenService.clearToken();
      this.boardsStateService.clear();
      this.boardPermissionsService.clear();
      await this.router.navigate(['/']);
    } finally {
      this.isLoggingOut.set(false);
    }
  }

  ngOnInit(): void {
    this.syncRouteData();
    // syncRouteData every NavigationEnd
    this.router.events
    .pipe(filter((e) => e instanceof NavigationEnd))
    .subscribe(() => this.syncRouteData());
  }

  // setting signals to data from active route
  private syncRouteData(): void {
    let current = this.activatedRoute.root;
    while (current.firstChild) {
      current = current.firstChild;
    }

    const breadcrumbs = (current.snapshot.data['breadcrumbs'] as Breadcrumb[] | undefined) ?? [];
    const board = current.snapshot.data['board'] as BoardResponseDto | undefined;

    this.breadcrumbs.set(breadcrumbs);
    this.board.set(board);
  }

}
