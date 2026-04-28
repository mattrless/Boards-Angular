import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { CreateBoardForm } from "../create-board-form/create-board-form";

@Component({
  selector: 'create-board-button',
  imports: [HlmCardImports, HlmButtonImports, HlmIcon, NgIcon, CreateBoardForm],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './create-board-button.html',
})
export class CreateBoardButton {
  readonly isShowingForm = signal<boolean>(false);

  closeCreateBoardForm(): void {
    this.isShowingForm.set(false);
  }

  showCreateBoardForm(): void {
    this.isShowingForm.set(true);
  }
}
