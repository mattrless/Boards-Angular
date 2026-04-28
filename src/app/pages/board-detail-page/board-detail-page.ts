import { Component, input } from '@angular/core';

@Component({
  selector: 'board-detail-page',
  imports: [],
  templateUrl: './board-detail-page.html',
})
export default class BoardDetailPage {
  boardId = input.required({
    transform: (boardIdParam: string) => Number(boardIdParam)
  });


}
