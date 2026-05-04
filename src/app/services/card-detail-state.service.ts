import { computed, inject, Injectable, signal } from '@angular/core';
import { CardsService } from '../api/generated/cards/cards.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardDetailStateService } from './board-detail-state.service';
import { CardResponseDto } from '../api/generated/model';
import { of } from 'rxjs';
import { CardDetailParams } from '../pages/board-detail-page/types/CardDetailParams';

@Injectable({
  providedIn: 'root',
})
export class CardDetailStateService {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly cardsService = inject(CardsService);

  readonly boardId = computed(() => this.boardDetailStateService.boardId());
  readonly listId = signal<number | null>(null);
  readonly cardId = signal<number | null>(null);

  readonly card = rxResource<CardResponseDto | null, CardDetailParams >({
    params: () => ({
      boardId: this.boardId(),
      listId: this.listId(),
      cardId: this.cardId(),
    }),
    stream: ({ params }) => {
      if (params.boardId == null || params.listId == null || params.cardId == null) {
        return of(null);
      }

      return this.cardsService.findCardById(
        params.boardId,
        params.listId,
        params.cardId
      );
    },
    defaultValue: null
  });

  openCard(listId: number, cardId: number): void {
    this.listId.set(listId);
    this.cardId.set(cardId);
  }

  reloadCard(): void {
    this.card.reload();
  }

  clear(): void {
    this.listId.set(null);
    this.cardId.set(null);
  }
}
