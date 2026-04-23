import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'login-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports],
  templateUrl: './login-form.html',
})
export class LoginForm {}
