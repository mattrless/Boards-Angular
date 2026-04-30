import { Component, effect, inject, input, output, signal } from '@angular/core';
import { BoardListResponseDto } from '../../../../api/generated/model/boardListResponseDto';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardListsService } from '../../../../api/generated/board-lists/board-lists.service';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { UpdateBoardListDto } from '../../../../api/generated/model';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { lucideX, lucideCheck } from '@ng-icons/lucide';

@Component({
  selector: 'edit-list-form',
  imports: [ReactiveFormsModule, HlmFieldImports, HlmButtonImports, HlmInputImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideX, lucideCheck })],
  templateUrl: './edit-list-form.html',
})
export class EditListForm {
  readonly list = input.required<BoardListResponseDto>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly boardListsService = inject(BoardListsService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly boardId = this.boardDetailStateService.boardId;

  readonly isSubmitting = signal<boolean>(false);
  readonly serverError = signal<string>("");

  readonly closeListForm = output<void>();

  readonly listForm = this.fb.group({
    title: ['', Validators.required],
  });

  // setting default value to input
  constructor() {
    effect(() => {
      const list = this.list();
      this.listForm.patchValue({ title: list.title ?? '' });
    });
  }

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.listForm.invalid){
      this.listForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const listFormValues: UpdateBoardListDto = this.listForm.getRawValue();

    const boardId = this.boardId();
    const listId = this.list().id;

    if (!boardId || !listId) {
      toast.error('Invalid data');
      return;
    }

    this.boardListsService.updateBoardList(boardId, listId, listFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("List updated");
        this.boardDetailStateService.reloadLists();
        this.closeListForm.emit();
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
