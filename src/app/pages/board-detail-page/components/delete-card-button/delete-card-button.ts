import { toast } from '@spartan-ng/brain/sonner';
import { CardsService } from './../../../../api/generated/cards/cards.service';
import { BoardDetailStateService } from './../../../../services/board-detail-state.service';
import { Component, inject, input, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { CardDetailStateService } from '../../../../services/card-detail-state.service';

@Component({
  selector: 'delete-card-button',
  imports: [HlmButtonImports],
  templateUrl: './delete-card-button.html',
})
export class DeleteCardButton {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly cardDetailStateService = inject(CardDetailStateService);
  private readonly cardsService = inject(CardsService);

  readonly listId = input.required<number>();
  readonly cardId = input.required<number>();
  readonly boardId = this.boardDetailStateService.boardId;

  readonly isDeleting = signal<boolean>(false);
  deleteCard() {
    this.isDeleting.set(true);
    if(this.listId == null || this.cardId == null || this.boardId() == null) {
      toast.error("Something went wrong");
      return;
    }

    this.cardsService.removeCard(this.boardId()!, this.listId(), this.cardId())
    .subscribe({
      next: () => {
        toast.success('Card deleted');
        this.boardDetailStateService.reloadCardsForList(this.listId());
        this.cardDetailStateService.clear();
      }
    })
  }
}
