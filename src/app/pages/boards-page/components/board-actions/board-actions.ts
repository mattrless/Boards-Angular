import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucidePencil, lucideEllipsis, lucideTrash } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { BoardsStateService } from '../../../../services/boards-state.service';
import { toast } from '@spartan-ng/brain/sonner';
import { BoardsService } from '../../../../api/generated/boards/boards.service';

@Component({
  selector: 'board-actions',
  imports: [HlmDropdownMenuImports, HlmIcon, NgIcon, HlmButtonImports, HlmAlertDialogImports],
  providers: [provideIcons({ lucidePencil, lucideTrash, lucideEllipsis })],
  templateUrl: './board-actions.html',
})
export class BoardActions {
  private readonly boardsService = inject(BoardsService);
  private readonly boardsStateService = inject(BoardsStateService);

  readonly boardId = input.required<number>();

  readonly canUpdate = input.required<boolean>();
  readonly canDelete = input.required<boolean>();

  readonly showForm = output<void>();

  onCancel(ctx: { close: () => void }): void {
    ctx.close();
  }

  onConfirmDelete(ctx: { close: () => void }) {
    this.boardsService.removeBoard(this.boardId())
    .subscribe({
      next: () => {
        toast.success("Board deleted");
        this.boardsStateService.reload();
        ctx.close();
      }
    });
  }
}
