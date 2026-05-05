import { Component, effect, inject, input, output, signal } from '@angular/core';
import { BoardResponseDto, UpdateBoardDto } from '../../../../api/generated/model';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { BoardsService } from '../../../../api/generated/boards/boards.service';
import { BoardsStateService } from '../../../../services/boards-state.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'edit-board-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, ReactiveFormsModule],
  templateUrl: './edit-board-form.html',
})
export class EditBoardForm {
  readonly board = input.required<BoardResponseDto>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly boardsService = inject(BoardsService);
  private readonly boardsStateService = inject(BoardsStateService);

  readonly closeBoardForm = output<void>();

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  readonly boardForm = this.fb.group({
    name: ['', Validators.required]
  });
  // setting default value to input
  constructor() {
    effect(() => {
      const board = this.board();
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

    const boardId = this.board().id;
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
        this.closeBoardForm.emit();
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
}
