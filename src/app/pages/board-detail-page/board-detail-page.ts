import { CardsService } from './../../api/generated/cards/cards.service';
import { BoardPermissionsService } from './../../services/board-permissions.service';
import { BoardDetailStateService } from './../../services/board-detail-state.service';
import { Component, computed, effect, inject } from '@angular/core';
import { ListItem } from './components/list-item/list-item';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { BoardListResponseDto } from '../../api/generated/model/boardListResponseDto';
import { CardResponseDto, UpdateBoardListPositionDto, UpdateCardPositionDto } from '../../api/generated/model';
import { BoardListsService } from '../../api/generated/board-lists/board-lists.service';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize } from 'rxjs';
import { CreateListItem } from './components/create-list-item/create-list-item';
import { CardDropData } from './types/CardDropData';

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
  private readonly cardsService = inject(CardsService);

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

  dropList(event: CdkDragDrop<BoardListResponseDto[]>) {
    if (event.previousIndex === event.currentIndex) return;
    if (!this.canUpdateList()) {
      toast.error("Board members can't move lists");
      return;
    }

    const previousLists = [...this.lists.value()!];
    const newLists = [...previousLists];

    moveItemInArray(newLists, event.previousIndex, event.currentIndex);

    const movedList = newLists[event.currentIndex];
    const prevListId = newLists[event.currentIndex - 1]?.id;
    const nextListId = newLists[event.currentIndex + 1]?.id;

    const boardId = this.boardId();
    const movedListId = movedList?.id;

    if (!boardId || !movedListId) {
      toast.error('Invalid list move');
      return;
    }

    const data: UpdateBoardListPositionDto = {};

    if (prevListId !== undefined) data.prevBoardListId = prevListId;
    if (nextListId !== undefined) data.nextBoardListId = nextListId;

    this.lists.set(newLists);

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

  dropCard(event: CdkDragDrop<CardDropData, CardDropData>) {
    const boardId = this.boardId();
    if (!boardId) {
      toast.error('Invalid board id');
      return;
    }

    const source = event.previousContainer.data;
    const target = event.container.data;

    if (!source.listId || !target.listId) {
      toast.error('Invalid list id');
      return;
    }

    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }

    const sourceCards = [...source.cards];
    const targetCards = source.listId === target.listId ? sourceCards : [...target.cards];

    let movedCard: CardResponseDto | undefined;

    if (event.previousContainer === event.container) {
      moveItemInArray(targetCards, event.previousIndex, event.currentIndex);
      movedCard = targetCards[event.currentIndex];
    } else {
      transferArrayItem(sourceCards, targetCards, event.previousIndex, event.currentIndex);
      movedCard = targetCards[event.currentIndex];
    }

    const cardId = movedCard?.id;
    if (!cardId) {
      toast.error('Invalid card id');
      return;
    }

    const prevCardId = targetCards[event.currentIndex - 1]?.id;
    const nextCardId = targetCards[event.currentIndex + 1]?.id;

    const movedToDifferentList: boolean = source.listId !== target.listId;
    const data: UpdateCardPositionDto = {};

    this.boardDetailStateService.setCardsForList(source.listId, sourceCards);
    if (movedToDifferentList) {
      this.boardDetailStateService.setCardsForList(target.listId, targetCards);
      data.targetBoardListId = target.listId;
    }
    if (prevCardId != null) data.prevCardId = prevCardId;
    if (nextCardId != null) data.nextCardId = nextCardId;

    this.cardsService.updateCardPosition(boardId, cardId, data)
      .pipe(
        finalize(() => {
          this.boardDetailStateService.reloadCardsForList(source.listId!);

          if (source.listId !== target.listId) {
            this.boardDetailStateService.reloadCardsForList(target.listId!);
          }
        })
      )
      .subscribe({
        next: () => toast.success('Card moved'),
        error: () => toast.error('Error moving card'),
      });
  }

}
