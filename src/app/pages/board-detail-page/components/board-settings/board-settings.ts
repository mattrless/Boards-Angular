import { Component, inject } from '@angular/core';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { lucideSettings } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from "@spartan-ng/helm/icon";
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { BoardGeneralSettings } from "../board-general-settings/board-general-settings";

@Component({
  selector: 'board-settings',
  imports: [HlmButtonImports, HlmDialogImports, HlmIcon, NgIcon, HlmTabsImports, BoardGeneralSettings],
  providers: [provideIcons({ lucideSettings })],
  templateUrl: './board-settings.html',
})
export class BoardSettings {
  private readonly boardDetailStateService = inject(BoardDetailStateService);

  readonly board = this.boardDetailStateService.board;

}
