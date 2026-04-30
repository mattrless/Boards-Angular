import { Component, input, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardListResponseDto } from '../../../../api/generated/model';
import { ListActions } from '../list-actions/list-actions';
import { EditListForm } from '../edit-list-form/edit-list-form';

@Component({
  selector: 'list-item',
  imports: [HlmCardImports, ListActions, EditListForm],
  templateUrl: './list-item.html',
})
export class ListItem {
  readonly list = input.required<BoardListResponseDto>();
  readonly canUpdateList = input.required<boolean>();
  readonly canDeleteList = input.required<boolean>();

  readonly isEditing = signal<boolean>(false);

  showEditForm(): void {
    this.isEditing.set(true);
  }

  closeForm(): void {
    this.isEditing.set(false);
  }
}
