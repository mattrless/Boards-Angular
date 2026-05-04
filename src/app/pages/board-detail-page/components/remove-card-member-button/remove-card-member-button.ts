import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserRoundMinus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'remove-card-member-button',
  imports: [NgIcon, HlmIcon, HlmButtonImports],
  providers: [provideIcons({ lucideUserRoundMinus })],
  templateUrl: './remove-card-member-button.html',
})
export class RemoveCardMemberButton {
  readonly isDeleting = input.required<boolean>();
  readonly memberId = input.required<number>();
  readonly remove = output<number>();
}
