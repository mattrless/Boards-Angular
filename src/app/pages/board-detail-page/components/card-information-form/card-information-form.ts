import { BoardDetailStateService } from './../../../../services/board-detail-state.service';
import { CardsService } from './../../../../api/generated/cards/cards.service';
import { Component, effect, inject, input, signal } from '@angular/core';
import { CardDetailStateService } from '../../../../services/card-detail-state.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { UpdateCardDto } from '../../../../api/generated/model';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'card-information-form',
  imports: [ReactiveFormsModule, HlmFieldImports, HlmButtonImports, HlmInputImports],
  templateUrl: './card-information-form.html',
})
export class CardInformationForm {
  private readonly cardDetailStateService = inject(CardDetailStateService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly cardsService = inject(CardsService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly listId = input.required<number>();
  readonly boardId = this.boardDetailStateService.boardId;

  readonly card = this.cardDetailStateService.card;
  readonly cardForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  readonly isSubmitting = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly serverError = signal<string>('');

  constructor() {
    effect(() => {
      const card = this.card.value();
      if (!card) return;
      this.cardForm.patchValue({
        title: card.title ?? '',
        description: card.description ?? ''
      });
    });
  }

  openFormEditor(): void {
    this.isEditing.set(true);
  }

  closeFormEditor(): void {
    this.isEditing.set(false);
  }

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.cardForm.invalid){
      this.cardForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const cardFormValues: UpdateCardDto = this.cardForm.getRawValue();

    const cardId = this.card.value()?.id;
    const boardId = this.boardId();

    if(cardId == null || boardId == null) {
      toast.error("Something went wrong");
      this.isSubmitting.set(false);
      return;
    }

    this.cardsService.updateCard(boardId, this.listId(), cardId, cardFormValues)
    .pipe(finalize( () => {
        this.isSubmitting.set(false);
      }
    ))
    .subscribe({
      next: () => {
        toast.success("Card updated");
        this.cardDetailStateService.reloadCard();
        this.boardDetailStateService.reloadCardsForList(this.listId());
        this.closeFormEditor();
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
