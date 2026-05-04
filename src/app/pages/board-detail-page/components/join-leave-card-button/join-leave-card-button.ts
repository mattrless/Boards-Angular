import { CardMembersService } from './../../../../api/generated/card-members/card-members.service';
import { Component, inject, input, output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { CreateCardAssignmentDto } from '../../../../api/generated/model';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';

@Component({
  selector: 'join-leave-card-button',
  imports: [HlmButtonImports, HlmIcon, NgIcon],
  templateUrl: './join-leave-card-button.html',
})
export class JoinLeaveCardButton {
  private readonly cardMembersService = inject(CardMembersService);
  readonly userIsMember = input.required<boolean>();
  readonly boardId = input.required<number>();
  readonly cardId = input.required<number>();
  readonly userId = input.required<number>();

  readonly isSubmitting = signal<boolean>(false);
  readonly membersChanged = output<void>();

  handleAssignment(): void {
    this.isSubmitting.set(true);

    if(this.boardId() == null || this.cardId() == null) {
      toast.error("Error");
      return;
    }

    if (this.userIsMember()) {
      this.cardMembersService.deleteCardAssignment(this.boardId(), this.cardId(), this.userId())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          toast.success('You left the card');
          this.membersChanged.emit();
        }
      });
    } else {
      const data: CreateCardAssignmentDto = {
        userId: this.userId()
      }
      this.cardMembersService.createCardAssignment(this.boardId(), this.cardId(), data)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          toast.success('You are a member');
          this.membersChanged.emit();
        }
      });
    }
  }
}
