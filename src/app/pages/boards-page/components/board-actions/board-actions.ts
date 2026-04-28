import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucidePencil, lucideTrash, lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'board-actions',
  imports: [HlmDropdownMenuImports, HlmIcon, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucidePencil, lucideTrash, lucideEllipsis })],
  templateUrl: './board-actions.html',
})
export class BoardActions {
  canUpdate = input.required<boolean>();
  canDelete = input.required<boolean>();
}
