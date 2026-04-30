import { BoardPermissionsService } from './../../services/board-permissions.service';
import { BoardDetailStateService } from './../../services/board-detail-state.service';
import { Component, computed, effect, inject } from '@angular/core';
import { ListItem } from './components/list-item/list-item';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { BoardListResponseDto } from '../../api/generated/model/boardListResponseDto';
import { UpdateBoardListPositionDto } from '../../api/generated/model';
import { BoardListsService } from '../../api/generated/board-lists/board-lists.service';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { CreateListItem } from './components/create-list-item/create-list-item';

@Component({
  selector: 'board-detail-page',
  imports: [ListItem, CdkDropList, CdkDrag, CreateListItem],
  templateUrl: './board-detail-page.html',
  styleUrl: './board-detail-page.css'
})
export default class BoardDetailPage {
  private readonly boardPermissionsService = inject(BoardPermissionsService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly boardListsService = inject(BoardListsService);

  readonly boardId = this.boardDetailStateService.boardId;
  readonly lists = this.boardDetailStateService.lists;

  constructor() {
    // load board permissions in service
    effect(() => {
      const boardId = this.boardId();
      if (boardId) {
        this.boardPermissionsService.load(boardId);
      }
    });
  }

  readonly canCreateList = computed(() =>
    this.boardPermissionsService.has(this.boardId(), 'list_create')
  );

  readonly canUpdateList = computed(() =>
    this.boardPermissionsService.has(this.boardId(), 'list_update')
  );

  readonly canDeleteList = computed(() =>
    this.boardPermissionsService.has(this.boardId(), 'list_delete')
  );

  drop(event: CdkDragDrop<BoardListResponseDto[]>) {
    if (event.previousIndex === event.currentIndex) return;
    if (!this.canUpdateList()) {
      toast.error("Board members can't move lists");
      return;
    }

    const previousLists = [...this.lists.value()!];
    const currentLists = [...previousLists];

    moveItemInArray(currentLists, event.previousIndex, event.currentIndex);

    const movedList = currentLists[event.currentIndex];
    const prevListId = currentLists[event.currentIndex - 1]?.id;
    const nextListId = currentLists[event.currentIndex + 1]?.id;

    const boardId = this.boardId();
    const movedListId = movedList?.id;

    if (!boardId || !movedListId) {
      toast.error('Invalid list move');
      return;
    }

    const data: UpdateBoardListPositionDto = {};

    if (prevListId !== undefined) data.prevBoardListId = prevListId;
    if (nextListId !== undefined) data.nextBoardListId = nextListId;

    this.lists.set(currentLists);

    this.boardListsService.updateBoardListPosition(boardId, movedListId, data)
      .pipe(
        finalize(() => this.boardDetailStateService.reloadLists())
      )
      .subscribe({
        next: () => {
          toast.success("List moved");
        },
        error: () => {
          toast.error("Error moving list");
        }
      });
  }
}
