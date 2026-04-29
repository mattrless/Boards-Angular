import { inject, Injectable, signal } from '@angular/core';
import { BoardsService } from '../api/generated/boards/boards.service';
import { BoardPermissionsResponseDto } from '../api/generated/model';

@Injectable({ providedIn: 'root' })
export class BoardPermissionsService {
  private readonly boardsService = inject(BoardsService);

  private readonly permissionsByBoard = signal<Record<number, string[]>>({});
  private readonly loadingByBoard = signal<Record<number, boolean>>({});

  load(boardId: number): void {
    if (this.loadingByBoard()[boardId]) return;
    if (this.permissionsByBoard()[boardId]) return;

    this.loadingByBoard.update((s) => ({ ...s, [boardId]: true }));

    this.boardsService.findMyBoardPermissions(boardId).subscribe({
      next: (res: BoardPermissionsResponseDto) => {
        const permissions = res.permissions ?? [];
        this.permissionsByBoard.update((s) => ({ ...s, [boardId]: permissions }));
      },
      error: () => {
        this.permissionsByBoard.update((s) => ({ ...s, [boardId]: [] }));
      },
      complete: () => {
        this.loadingByBoard.update((s) => ({ ...s, [boardId]: false }));
      },
    });
  }

  has(boardId: number | null | undefined, permission: string): boolean {
    if (!boardId) return false;
    return (this.permissionsByBoard()[boardId] ?? []).includes(permission);
  }

  invalidate(boardId: number): void {
    this.permissionsByBoard.update((s) => {
      const next = { ...s };
      delete next[boardId];
      return next;
    });
  }

  reload(boardId: number): void {
    this.invalidate(boardId);
    this.load(boardId);
  }

  clear(): void {
    this.permissionsByBoard.set({});
    this.loadingByBoard.set({});
  }
}
