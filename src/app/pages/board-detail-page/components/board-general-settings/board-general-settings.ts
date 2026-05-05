import { BoardsService } from './../../../../api/generated/boards/boards.service';
import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardsStateService } from '../../../../services/boards-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { UpdateBoardDto } from '../../../../api/generated/model';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { lucideTrash } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'board-general-settings',
  imports: [HlmCardImports, HlmButtonImports, HlmInputImports, HlmFieldImports, ReactiveFormsModule, HlmAlertDialogImports, HlmIcon, NgIcon],
  providers: [provideIcons({ lucideTrash })],
  templateUrl: './board-general-settings.html',
})
export class BoardGeneralSettings {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly boardsService = inject(BoardsService);
  private readonly boardsStateService = inject(BoardsStateService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly router = inject(Router);

  readonly board = this.boardDetailStateService.board;

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  readonly boardForm = this.fb.group({
    name: ['', Validators.required]
  });
  // setting default value to input
  constructor() {
    effect(() => {
      const board = this.board.value();
      if(board == null) return;
      this.boardForm.patchValue({ name: board.name ?? '' });
    });
  }

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.boardForm.invalid){
      this.boardForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const boardFormValues: UpdateBoardDto = this.boardForm.getRawValue();

    const boardId = this.board.value()?.id;
    if (boardId == null) {
      this.serverError.set('Invalid board id');
      return;
    }

    this.boardsService.updateBoard(boardId, boardFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("Board updated");
        this.boardsStateService.reload();
        this.boardDetailStateService.reloadBoard();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 400) {
          this.serverError.set('Invalid data');
        } else {
          this.serverError.set('Something went wrong, try again');
        }
      }
    });
  }

  onDeleteBoard(ctx: { close: () => void }): void {
    const boardId = this.board.value()?.id;
    if (boardId == null) {
      toast.error('Invalid board id');
      return;
    }

    this.boardsService.removeBoard(boardId).subscribe({
      next: async () => {
        toast.success('Board deleted');
        this.boardsStateService.reload();
        this.boardDetailStateService.clear();
        ctx.close();
        await this.router.navigate(['/boards']);
      },
      error: () => {
        toast.error('Something went wrong, try again');
      }
    });
  }

}
