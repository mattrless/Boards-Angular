import { Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'auth-container',
  imports: [HlmTabsImports, LoginForm, RegisterForm],
  templateUrl: './auth-container.html',
})
export class AuthContainer {}
