import { HlmButtonImports } from './../../../../ui/button/src/index';
import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSparkles, lucideSpellCheck } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'ai-button',
  imports: [HlmTooltipImports, NgIcon, HlmIcon, HlmButtonImports],
  providers: [provideIcons({ lucideSparkles, lucideSpellCheck })],
  templateUrl: './ai-button.html',
})
export class AiButton {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly gradient = input.required<string>();
  readonly isUsingAi = input.required<boolean>();
  readonly tooltipMessage = input.required<string>();

  readonly clicked = output<void>();
}
