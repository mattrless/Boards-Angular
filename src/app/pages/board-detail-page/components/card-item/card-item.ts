import { CardDetailStateService } from './../../../../services/card-detail-state.service';
import { Component, inject, input } from '@angular/core';
import { CardResponseDto } from '../../../../api/generated/model';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { CardInformationForm } from '../card-information-form/card-information-form';
import { DeleteCardButton } from '../delete-card-button/delete-card-button';
import { CardMembersDataTable } from '../card-members-data-table/card-members-data-table';

@Component({
  selector: 'card-item',
  imports: [HlmButtonImports, HlmDialogImports, CardInformationForm, DeleteCardButton, CardMembersDataTable],
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
    // loading card in service
    this.cardDetailStateService.openCard(listId, cardId);
  }

}
