import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardListResponseDto, CardResponseDto } from '../../../../api/generated/model';
import { ListActions } from '../list-actions/list-actions';
import { EditListForm } from '../edit-list-form/edit-list-form';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { CardItem } from '../card-item/card-item';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CardDropData } from '../../types/CardDropData';

@Component({
  selector: 'list-item',
  imports: [HlmCardImports, ListActions, EditListForm, CardItem, CdkDrag, CdkDropList],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css'
})
export class ListItem {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  readonly list = input.required<BoardListResponseDto>();
  readonly canUpdateList = input.required<boolean>();
  readonly canDeleteList = input.required<boolean>();

  readonly cardDropped = output<CdkDragDrop<CardDropData, CardDropData>>();

  readonly isEditing = signal<boolean>(false);

  readonly cards = computed(() => {
    return this.boardDetailStateService.cardsForList(this.list().id);
  });

  readonly connectedListIds = computed(() => {
    const lists = this.boardDetailStateService.lists.value() ?? [];
    const currentId = this.list().id;
    return lists
      .map((l) => `list-${l.id}`)
      .filter((id) => id !== `list-${currentId}`);
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
