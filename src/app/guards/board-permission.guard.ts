import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BoardsService } from '../api/generated/boards/boards.service';

export const boardPermissionGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const boardsService = inject(BoardsService);

  const rawId = route.paramMap.get('boardId');
  const boardId = Number(rawId);

  if (!Number.isFinite(boardId)) {
    return router.createUrlTree(['/forbidden']);
  }

  try {
    const res = await firstValueFrom(boardsService.findMyBoardPermissions(boardId));
    const permissions = res.permissions ?? [];

    return permissions.includes('board_read_full_board')
      ? true
      : router.createUrlTree(['/forbidden']);
  } catch {
    return router.createUrlTree(['/forbidden']);
  }
};
