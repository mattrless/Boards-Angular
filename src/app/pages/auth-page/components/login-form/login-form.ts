import { AuthSessionService } from './../../../../services/auth-session.service';
import { AuthService } from './../../../../api/generated/auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from '@spartan-ng/helm/input';
import { LoginResponseDto, LoginUserDto } from '../../../../api/generated/model';
import { JwtTokenService } from '../../../../services/jwt-token.service';
import { Router } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'login-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, ReactiveFormsModule],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private authSessionService = inject(AuthSessionService);
  private jwtTokenService = inject(JwtTokenService);
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

    this.authService.login(loginFormValues)
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: async (res: LoginResponseDto) => {
        const { access_token } = res;
        if (!access_token) {
          this.serverError.set('Invalid access token');
          return;
        }

        this.jwtTokenService.setToken(access_token);

        try {
          await firstValueFrom(this.authSessionService.loadSession());
          toast.success('Welcome!!');
          await this.router.navigate(['/boards']);
        } catch {
          this.jwtTokenService.clearToken();
          this.authSessionService.clearSession();
          this.serverError.set('Something went wrong loading your session, try again');
        }
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 401) {
          this.serverError.set('Invalid credentials');
        } else {
          this.serverError.set('Something went wrong, try again');
        }
      },
    });


  }
}
