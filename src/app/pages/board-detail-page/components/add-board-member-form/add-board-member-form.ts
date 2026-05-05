import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardMembersService } from '../../../../api/generated/board-members/board-members.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { toast } from '@spartan-ng/brain/sonner';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { AddBoardMemberDto } from '../../../../api/generated/model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'add-board-member-form',
  imports: [HlmButtonImports, HlmInputImports, HlmFieldImports, ReactiveFormsModule],
  templateUrl: './add-board-member-form.html',
})
export class AddBoardMemberForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly boardMembersService = inject(BoardMembersService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly board = this.boardDetailStateService.board;

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  readonly boardMemberForm = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'submit',
    }),
  });

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.boardMemberForm.invalid){
      this.boardMemberForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const boardMemberFormValues: AddBoardMemberDto = this.boardMemberForm.getRawValue();

    const boardId = this.board.value()?.id;
    if (boardId == null) {
      this.serverError.set('Invalid board id');
      return;
    }

    this.boardMembersService.addBoardMember(boardId, boardMemberFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("Member added");
        this.boardDetailStateService.reloadBoard();
        this.boardMemberForm.patchValue({ email: '' });
        this.boardMemberForm.markAsUntouched();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 400) {
          this.serverError.set('Invalid data');
        } else if (e.status === 409) {
          this.serverError.set('User already a member of this board');
        } else {
          this.serverError.set('Something went wrong, try again');
        }
      }
    });
  }
}
