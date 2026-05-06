import { Component, computed, inject, input, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { BoardMembersService } from '../../../../api/generated/board-members/board-members.service';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { toast } from '@spartan-ng/brain/sonner';
import { UpdateBoardRoleDto } from '../../../../api/generated/model';
import { finalize } from 'rxjs';
import { BoardsService } from '../../../../api/generated/boards/boards.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'board-member-actions',
  imports: [HlmButtonImports],
  templateUrl: './board-member-actions.html',
})
export class BoardMemberActions {
  private readonly boardMembersService = inject(BoardMembersService);
  private readonly boardsService = inject(BoardsService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly memberId = input.required<number>();
  readonly boardRole = input.required<string>();
  readonly canRemove = input.required<boolean>();
  readonly loggedUserIsOwner = input.required<boolean>();

  readonly isSubmitting = signal<boolean>(false);

  readonly targetBoardRole = computed(() => this.boardRole() === 'member' ? 'admin' : 'member');

  changeRole(): void {
    if(this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const data: UpdateBoardRoleDto = {
      role: this.targetBoardRole()
    }

    const memberId = this.memberId();
    const boardId = this.boardDetailStateService.boardId();

    if(memberId == null || boardId == null){
      toast.error('Try again later');
      this.isSubmitting.set(false);
      return;
    }
    this.boardMembersService.updateBoardMemberRole(boardId, memberId, data)
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        toast.success('Role updated');
        this.boardDetailStateService.reloadMembers();
      },
      error: () => {
        toast.error('Something went wrong, try again');
      }
    })
  }

  makeOwner(): void {
    if(this.isSubmitting()) return;

    this.isSubmitting.set(true)

    const memberId = this.memberId();
    const boardId = this.boardDetailStateService.boardId();

    if(memberId == null || boardId == null){
      toast.error('Try again later');
      this.isSubmitting.set(false);
      return;
    }

    this.boardsService.transferBoardOwnership(boardId, memberId)
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        toast.success('Role updated');
        this.boardDetailStateService.reloadMembers();
      },
      error: (e: HttpErrorResponse) => {
      if (e.status === 403) {
        toast.error('Only the owner can transfer ownership');
      } else {
        toast.error('Something went wrong, try again');
      }
    }
    })
  }

  removeMember(): void {
    if(this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const memberId = this.memberId();
    const boardId = this.boardDetailStateService.boardId();

    if(memberId == null || boardId == null){
      toast.error('Try again later');
      this.isSubmitting.set(false);
      return;
    }
    this.boardMembersService.removeBoardMember(boardId, memberId)
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        toast.success('Member removed');
        this.boardDetailStateService.reloadMembers();
      },
      error: () => {
        toast.error('Something went wrong, try again');
      }
    })
  }
}
