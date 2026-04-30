import { BoardsService } from './../api/generated/boards/boards.service';
import { inject, Injectable, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardResponseDto } from '../api/generated/model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardDetailStateService {
  private readonly boardsService = inject(BoardsService);

  readonly boardId = signal<number | null>(null);

  readonly board = rxResource<BoardResponseDto| null, number | null>({
    params: () => this.boardId(),
    stream: ({ params }) => {
      // avoid request when boardId is not a number
      if (params == null) return of(null);
      return this.boardsService.findBoardById(params);
    },
    defaultValue: null,
  });

  reload(): void {
    this.board.reload();
  }

  clear(): void {
    this.board.set(null);
  }
}
