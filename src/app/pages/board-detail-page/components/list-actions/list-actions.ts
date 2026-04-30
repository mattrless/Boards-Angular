import { BoardListsService } from './../../../../api/generated/board-lists/board-lists.service';
import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash, lucideEllipsis } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'list-actions',
  imports: [HlmDropdownMenuImports, HlmIcon, NgIcon, HlmButtonImports, HlmAlertDialogImports],
  providers: [provideIcons({ lucidePencil, lucideTrash, lucideEllipsis })],
  templateUrl: './list-actions.html',
})
export class ListActions {
  private readonly boardListsService = inject(BoardListsService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly canUpdateList = input.required<boolean>();
  readonly canDeleteList = input.required<boolean>();

  readonly boardId = this.boardDetailStateService.boardId;
  readonly listId = input.required<number>();

  readonly showForm = output<void>();

  onCancel(ctx: { close: () => void }): void {
    ctx.close();
  }

  onConfirmDelete(ctx: { close: () => void }) {
    const boardId = this.boardId();
    const listId = this.listId();

    if (!boardId || !listId) {
      toast.error('Invalid data');
      return;
    }

    this.boardListsService.removeBoardList(boardId, listId)
    .subscribe({
      next: () => {
        toast.success("List deleted");
        this.boardDetailStateService.reloadLists();
        ctx.close();
      },
      error: () => {
        toast.error('Error deleting list');
      }
    });
  }

}
