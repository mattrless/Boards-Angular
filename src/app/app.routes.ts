import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: "",
    canActivate: [guestGuard],
    loadComponent: () => import("./pages/auth-page/auth-page"),
  },
  {
    path: "boards",
    canActivate: [authGuard],
    loadComponent: () => import('./pages/boards-page/boards-page'),
  },
  {
    path: "**",
    redirectTo: ''
  }
];
