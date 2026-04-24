import { AuthService } from './../../../../api/generated/auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from '@spartan-ng/helm/input';
import { LoginResponseDto, LoginUserDto } from '../../../../api/generated/model';
import { JwtTokenService } from '../../../../services/jwt-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, ReactiveFormsModule],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private jwtTokenService = inject(JwtTokenService)
  private router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.isSubmitting()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const loginFormValues: LoginUserDto = this.loginForm.getRawValue();

    this.authService.login(loginFormValues).subscribe({
      next: (res: LoginResponseDto) => {
        const { access_token } = res;
        if (!access_token) {
          this.serverError.set('Invalid access token');
          return;
        }

        this.jwtTokenService.setToken(access_token);
        this.router.navigate(['/boards']);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
