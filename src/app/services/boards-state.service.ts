import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardsService } from '../api/generated/boards/boards.service';
import { BoardResponseDto } from '../api/generated/model';

@Injectable({
  providedIn: 'root',
})
export class BoardsStateService {
  private readonly boardsService = inject(BoardsService);

  readonly boards = rxResource<BoardResponseDto[], undefined>({
    defaultValue: [],
    stream: () => this.boardsService.findMyBoards(),
  });

  reload(): void {
    this.boards.reload();
  }
}
