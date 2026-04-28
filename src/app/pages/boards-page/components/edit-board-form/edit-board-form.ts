import { Component, input } from '@angular/core';
import { BoardResponseDto } from '../../../../api/generated/model';

@Component({
  selector: 'edit-board-form',
  imports: [],
  templateUrl: './edit-board-form.html',
})
export class EditBoardForm {
  board = input.required<BoardResponseDto>();
}
