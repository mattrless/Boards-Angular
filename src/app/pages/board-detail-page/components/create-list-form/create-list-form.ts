import { BoardDetailStateService } from './../../../../services/board-detail-state.service';
import { BoardListsService } from './../../../../api/generated/board-lists/board-lists.service';
import { Component, inject, output, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { CreateBoardListDto } from '../../../../api/generated/model/createBoardListDto';

@Component({
  selector: 'create-list-form',
  imports: [ReactiveFormsModule, HlmFieldImports, HlmButtonImports, HlmInputImports, NgIcon, HlmIcon],
  providers: [provideIcons({lucideCheck, lucideX})],
  templateUrl: './create-list-form.html',
})
export class CreateListForm {
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

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.listForm.invalid){
      this.listForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const listFormValues: CreateBoardListDto = this.listForm.getRawValue();

    const boardId = this.boardId();
    if (!boardId) {
      this.isSubmitting.set(false);
      toast.error('Invalid board id');
      return;
    }

    this.boardListsService.createBoardList(boardId, listFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("List created");
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
