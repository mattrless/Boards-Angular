import { AuthSessionService } from './auth-session.service';
import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardsService } from '../api/generated/boards/boards.service';
import { BoardResponseDto } from '../api/generated/model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardsStateService {
  private readonly boardsService = inject(BoardsService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly boards = rxResource<BoardResponseDto[], boolean>({
    // reload resource when isAuthenticated changes
    params: () => this.authSessionService.isAuthenticated(),
    stream: ({ params }) => {
      // avoid request when user is not authenticated
      if (!params) return of([]);
      return this.boardsService.findMyBoards();
    },
    defaultValue: [],
  });

  readonly sharedBoards = computed<BoardResponseDto[]>(() => {
    return (this.boards.value() ?? []).filter(b => !b.ownedByCurrentUser)
  });

  readonly ownedBoards = computed<BoardResponseDto[]>(() => {
    return (this.boards.value() ?? []).filter(b => !!b.ownedByCurrentUser)
  });

  reload(): void {
    this.boards.reload();
  }

  clear() :void {
    this.boards.set([]);
  }
}
