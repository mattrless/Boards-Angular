import { BoardListsService } from './../api/generated/board-lists/board-lists.service';
import { BoardsService } from './../api/generated/boards/boards.service';
import { inject, Injectable, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardListResponseDto, BoardResponseDto } from '../api/generated/model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardDetailStateService {
  private readonly boardsService = inject(BoardsService);
  private readonly boardListsService = inject(BoardListsService);

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

  readonly lists = rxResource<BoardListResponseDto[]| null, number | null>({
    params: () => this.boardId(),
    stream: ({ params }) => {
      // avoid request when boardId is not a number
      if (params == null) return of(null);
      return this.boardListsService.findAllBoardLists(params);
    },
    defaultValue: null,
  });

  reloadBoard(): void {
    this.board.reload();
  }

  reloadLists(): void {
    this.lists.reload();
  }

  clear(): void {
    this.boardId.set(null);
    this.board.set(null);
    this.lists.set(null);
  }
}
