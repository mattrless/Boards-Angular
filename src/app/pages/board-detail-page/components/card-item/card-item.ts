import { CardDetailStateService } from './../../../../services/card-detail-state.service';
import { Component, inject, input } from '@angular/core';
import { CardResponseDto } from '../../../../api/generated/model';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { CardInformationForm } from '../card-information-form/card-information-form';
import { DeleteCardButton } from '../delete-card-button/delete-card-button';

@Component({
  selector: 'card-item',
  imports: [HlmButtonImports, HlmDialogImports, CardInformationForm, DeleteCardButton],
  templateUrl: './card-item.html',
})
export class CardItem {
  private readonly cardDetailStateService = inject(CardDetailStateService);

  readonly itemCard = input.required<CardResponseDto>();
  readonly listId = input.required<number>();

  openCard(): void {
    const cardId = this.itemCard().id;
    const listId = this.listId();

    if (cardId == null) return;

    this.cardDetailStateService.openCard(listId, cardId);
  }

}
