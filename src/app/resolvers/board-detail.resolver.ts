import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BoardDetailStateService } from '../services/board-detail-state.service';
import { BoardResponseDto } from '../api/generated/model';
import { filter, firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const boardDetailResolver: ResolveFn<BoardResponseDto> = async (route, state) => {
  const boardDetailStateService = inject(BoardDetailStateService);

  // already validated by guard
  const rawId = route.paramMap.get('boardId');
  const boardId = Number(rawId);

  boardDetailStateService.boardId.set(boardId);

  // convert signal to observable and then to a promise
  return firstValueFrom(
    toObservable(boardDetailStateService.board.value).pipe(
      filter((b): b is BoardResponseDto => b != null)
    )
  );
};
