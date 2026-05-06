import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { BoardResponseDto } from '../../../../api/generated/model';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EditBoardForm } from '../edit-board-form/edit-board-form';
import { BoardPermissionsService } from '../../../../services/board-permissions.service';
import { BoardActions } from '../board-actions/board-actions';

@Component({
  selector: 'board-item',
  imports: [HlmCardImports, HlmButtonImports, RouterLink, DatePipe, EditBoardForm, BoardActions],
  templateUrl: './board-item.html',
})
export class BoardItem {
  private readonly boardPermissionsService = inject(BoardPermissionsService);

  readonly board = input.required<BoardResponseDto>();

  constructor() {
    // load board permissions in service
    effect(() => {
      const boardId = this.board().id;
      if (boardId) {
        this.boardPermissionsService.load(boardId);
      }
    });
  }

  readonly isEditingBoard = signal(false);
  readonly canUpdateBoard = computed(() =>
    this.boardPermissionsService.hasRole(this.board().id, 'admin')
  );
  readonly canDeleteBoard = computed(() => !!this.board().ownedByCurrentUser);

  showEditForm(): void {
    this.isEditingBoard.set(true);
  }

  closeEditForm(): void {
    this.isEditingBoard.set(false);
  }
}
