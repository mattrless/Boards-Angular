import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const boardIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rawId = route.paramMap.get('boardId');

  const id = Number(rawId);
  const isValid = Number.isInteger(id) && id > 0;

  return isValid ? true : router.createUrlTree(['/']);
};
