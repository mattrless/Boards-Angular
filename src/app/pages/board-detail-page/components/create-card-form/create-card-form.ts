import { BoardDetailStateService } from './../../../../services/board-detail-state.service';
import { CreateCardDto } from './../../../../api/generated/model/createCardDto';
import { CardsService } from './../../../../api/generated/cards/cards.service';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { finalize } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'create-card-form',
  imports: [ReactiveFormsModule, HlmFieldImports, HlmButtonImports, HlmInputImports, NgIcon, HlmIcon],
  providers: [provideIcons({lucideCheck, lucideX})],
  templateUrl: './create-card-form.html',
})
export class CreateCardForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cardsService = inject(CardsService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly boardId = computed(() => this.boardDetailStateService.boardId()!);
  readonly listId = input.required<number>();

  readonly isSubmitting = signal<boolean>(false);
  readonly serverError = signal<string>("");

  readonly closeCardForm = output<void>();

  readonly cardForm = this.fb.group({
    title: ['', Validators.required],
  });

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.cardForm.invalid){
      this.cardForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const cardFormValues: CreateCardDto = this.cardForm.getRawValue();

    this.cardsService.createCard(this.boardId(), this.listId(), cardFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("Card created");
        this.boardDetailStateService.reloadCardsForList(this.listId());
        this.closeCardForm.emit();
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
