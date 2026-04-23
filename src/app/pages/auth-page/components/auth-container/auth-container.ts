import { Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'auth-container',
  imports: [HlmTabsImports, LoginForm],
  templateUrl: './auth-container.html',
})
export class AuthContainer {}
