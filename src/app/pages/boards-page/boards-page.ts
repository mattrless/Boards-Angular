import { BoardsService } from './../../api/generated/boards/boards.service';
import { Component, inject } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { BoardResponseDto } from '../../api/generated/model';
import { rxResource } from '@angular/core/rxjs-interop';
import { BoardItem } from './components/board-item/board-item';
import { CreateBoardButton } from './components/create-board-button/create-board-button';

@Component({
  selector: 'boards-page',
  imports: [HlmTabsImports, BoardItem, CreateBoardButton],
  templateUrl: './boards-page.html',
})
export default class BoardsPage {
  private readonly boardsService = inject(BoardsService);

  readonly boards = rxResource<BoardResponseDto[], undefined>({
    defaultValue: [],
    stream: () => this.boardsService.findMyBoards(),
  });

  reloadBoards(): void {
    this.boards.reload();
  }
}
