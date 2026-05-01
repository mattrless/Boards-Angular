import { Component, input } from '@angular/core';
import { CardResponseDto } from '../../../../api/generated/model';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'card-item',
  imports: [HlmButtonImports],
  templateUrl: './card-item.html',
})
export class CardItem {
  readonly card = input.required<CardResponseDto>();
}
