import { computed, inject, Injectable, signal } from '@angular/core';
import { CardsService } from '../api/generated/cards/cards.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardDetailStateService } from './board-detail-state.service';
import { CardResponseDto, UserResponseDto } from '../api/generated/model';
import { of } from 'rxjs';
import { CardDetailParams } from '../pages/board-detail-page/types/CardDetailParams';
import { CardMembersService } from '../api/generated/card-members/card-members.service';

@Injectable({
  providedIn: 'root',
})
export class CardDetailStateService {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly cardMembersService = inject(CardMembersService);
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

  readonly cardMembers = rxResource<UserResponseDto[] | null, { boardId: number | null, cardId: number | null }>({
    params: () => ({
      boardId: this.boardId(),
      cardId:  this.cardId(),
    }),
    stream: ({ params }) => {
      if (params.boardId == null || params.cardId == null) return of(null);
      return this.cardMembersService.findCardAssignments(params.boardId, params.cardId);
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

  reloadMembers(): void {
    this.cardMembers.reload();
  }

  clear(): void {
    this.listId.set(null);
    this.cardId.set(null);
  }
}
