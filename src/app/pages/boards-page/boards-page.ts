import { Component, inject } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { BoardItem } from './components/board-item/board-item';
import { CreateBoardButton } from './components/create-board-button/create-board-button';
import { BoardsStateService } from '../../services/boards-state.service';

@Component({
  selector: 'boards-page',
  imports: [HlmTabsImports, BoardItem, CreateBoardButton],
  templateUrl: './boards-page.html',
})
export default class BoardsPage {
  private readonly boardsStateService = inject(BoardsStateService);

  readonly boards = this.boardsStateService.boards;
  readonly ownedBoards = this.boardsStateService.ownedBoards;
  readonly sharedBoards = this.boardsStateService.sharedBoards;
}
