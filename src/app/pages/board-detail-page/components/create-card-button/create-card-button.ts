import { Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { CreateCardForm } from '../create-card-form/create-card-form';

@Component({
  selector: 'create-card-button',
  imports: [HlmButtonImports, HlmIcon, NgIcon, CreateCardForm],
  host: { class: 'block w-full' },
  providers: [provideIcons({lucidePlus})],
  templateUrl: './create-card-button.html',
})
export class CreateCardButton {
  readonly isShowingForm = signal<boolean>(false);

  readonly listId = input.required<number>();
  showForm(): void {
    this.isShowingForm.set(true);
  }

  closeForm(): void {
    this.isShowingForm.set(false);
  }
}
