import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { CreateListForm } from '../create-list-form/create-list-form';

@Component({
  selector: 'create-list-item',
  imports: [HlmCardImports, HlmButtonImports, HlmIcon, NgIcon, CreateListForm],
  providers: [provideIcons({lucidePlus})],
  templateUrl: './create-list-item.html',
})
export class CreateListItem {
  readonly isShowingForm = signal<boolean>(false);

  showForm(): void {
    this.isShowingForm.set(true);
  }

  closeForm(): void {
    this.isShowingForm.set(false);
  }

}
