import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardListResponseDto } from '../../../../api/generated/model';

@Component({
  selector: 'list-item',
  imports: [HlmCardImports],
  templateUrl: './list-item.html',
})
export class ListItem {
  readonly list = input.required<BoardListResponseDto>();
}
