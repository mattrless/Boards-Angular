import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardListResponseDto } from '../../../../api/generated/model';
import { ListActions } from '../list-actions/list-actions';
import { EditListForm } from '../edit-list-form/edit-list-form';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { CardItem } from '../card-item/card-item';

@Component({
  selector: 'list-item',
  imports: [HlmCardImports, ListActions, EditListForm, CardItem],
  templateUrl: './list-item.html',
})
export class ListItem {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  readonly list = input.required<BoardListResponseDto>();
  readonly canUpdateList = input.required<boolean>();
  readonly canDeleteList = input.required<boolean>();

  readonly isEditing = signal<boolean>(false);

  readonly cards = computed(() => {
    return this.boardDetailStateService.cardsForList(this.list().id);
  });

  constructor() {
    effect(() => {
      const listId = this.list().id;
      if (listId) {
        this.boardDetailStateService.loadCardsForList(listId);
      }
    });
  }

  showEditForm(): void {
    this.isEditing.set(true);
  }

  closeForm(): void {
    this.isEditing.set(false);
  }
}
