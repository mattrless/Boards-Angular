import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard } from '@ng-icons/lucide';
import { AuthContainer } from './components/auth-container/auth-container';

@Component({
  selector: 'auth-page',
  imports: [HlmCardImports, NgIcon, HlmIcon, AuthContainer],
  providers: [provideIcons({ lucideLayoutDashboard })],
  templateUrl: './auth-page.html',
})
export default class AuthPage {}
