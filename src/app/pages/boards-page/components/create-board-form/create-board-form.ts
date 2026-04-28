import { Component, inject, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardsService } from '../../../../api/generated/boards/boards.service';
import { CreateBoardDto } from '../../../../api/generated/model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'create-board-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, ReactiveFormsModule],
  templateUrl: './create-board-form.html',
})
export class CreateBoardForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly boardsService = inject(BoardsService);

  readonly closeBoardForm = output<void>();
  readonly boardCreated = output<void>();

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  readonly boardForm = this.fb.group({
    name: ['', Validators.required]
  });

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.boardForm.invalid){
      this.boardForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const boardFormValues: CreateBoardDto = this.boardForm.getRawValue();

    this.boardsService.createBoard(boardFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("Board created");
        this.closeBoardForm.emit();
        this.boardCreated.emit();
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
