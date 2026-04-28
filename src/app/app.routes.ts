import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { roleGuard } from './guards/role.guard';
import { boardIdGuard } from './guards/board-id.guard';

export const routes: Routes = [
  {
    path: "",
    pathMatch: 'full',
    canActivate: [guestGuard],
    loadComponent: () => import("./pages/auth-page/auth-page"),
  },
  {
    path: '',
    loadComponent: () => import("./layouts/workspace-header/workspace-header"),
    canActivateChild: [authGuard],
    children: [
      {
        path: "boards",
        canActivate: [roleGuard],
        data: { roles: ['admin', 'user'], breadcrumbs: [{ label: "Boards", href: "" }] },
        loadComponent: () => import('./pages/boards-page/boards-page'),
      },
      {
        path: "boards/:boardId",
        canActivate: [roleGuard, boardIdGuard],
        data: { roles: ['admin', 'user'], breadcrumbs: [{ label: "Boards", href: "boards" }] },
        loadComponent: () => import('./pages/board-detail-page/board-detail-page'),
      },
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden-page/forbidden-page'),
  },
  {
    path: "**",
    redirectTo: ''
  }
];
