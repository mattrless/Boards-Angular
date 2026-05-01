import { BoardListsService } from './../api/generated/board-lists/board-lists.service';
import { BoardsService } from './../api/generated/boards/boards.service';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardListResponseDto, BoardResponseDto, CardResponseDto } from '../api/generated/model';
import { finalize, of } from 'rxjs';
import { CardsService } from '../api/generated/cards/cards.service';

@Injectable({
  providedIn: 'root',
})
export class BoardDetailStateService {
  private readonly boardsService = inject(BoardsService);
  private readonly boardListsService = inject(BoardListsService);
  private readonly cardsService = inject(CardsService);

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

  readonly cardsByListId = signal<Record<number, CardResponseDto[]>>({});
  readonly cardsLoadingByListId = signal<Record<number, boolean>>({});

  cardsForList(listId: number | null | undefined): CardResponseDto[] {
    if (!listId) return [];
    return this.cardsByListId()[listId] ?? [];
  }

  loadCardsForList(listId: number): void {
    if (this.cardsLoadingByListId()[listId]) return;
    if (this.cardsByListId()[listId]) return;

    const boardId = this.boardId();
    if(boardId == null){
      return;
    }
    this.cardsLoadingByListId.update((s) => ({ ...s, [listId]: true }));

    this.cardsService.findAllCards(boardId, listId)
    .pipe(
      finalize(() => {
        this.cardsLoadingByListId.update((s) => ({
          ...s,
          [listId]: false,
        }));
      })
    )
    .subscribe({
      next: (cards: CardResponseDto[]) => {
        this.cardsByListId.update((s) => ({
          ...s,
          [listId]: cards,
        }));
      },
      error: () => {
        this.cardsByListId.update((s) => ({
          ...s,
          [listId]: [],
        }));
      }
    });
  }

  reloadAllCardsForCurrentBoard(): void {
    const lists = this.lists.value() ?? [];
    for (const list of lists) {
      if (list.id) this.reloadCardsForList(list.id);
    }
  }

  reloadCardsForList(listId: number): void {
    if (this.cardsLoadingByListId()[listId]) return;

    const boardId = this.boardId();
    if (boardId == null) return;

    this.cardsLoadingByListId.update((s) => ({ ...s, [listId]: true }));

    this.cardsService.findAllCards(boardId, listId)
      .pipe(
        finalize(() => {
          this.cardsLoadingByListId.update((s) => ({ ...s, [listId]: false }));
        })
      )
      .subscribe({
        next: (cards) => {
          this.cardsByListId.update((s) => ({
            ...s,
            [listId]: cards,
          }));
        }
      });
  }

  setCardsForList(listId: number, cards: CardResponseDto[]): void {
    this.cardsByListId.update((s) => ({
      ...s,
      [listId]: cards,
    }));
  }

  reloadBoard(): void {
    this.board.reload();
  }

  reloadLists(): void {
    this.lists.reload();
  }

  clear(): void {
    this.boardId.set(null);
    this.board.set(null);
    this.lists.set([]);
    this.cardsByListId.set({});
    this.cardsLoadingByListId.set({});
  }
}
