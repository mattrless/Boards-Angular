import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { UsersService } from '../../../../api/generated/users/users.service';
import { imageUrlValidator } from '../../../../validators/image-url.validator';
import { matchFields } from '../../../../validators/match-fields.validator';
import { CreateUserDto, LoginResponseDto, LoginUserDto } from '../../../../api/generated/model';
import { finalize, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../api/generated/auth/auth.service';
import { JwtTokenService } from '../../../../services/jwt-token.service';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { AuthSessionService } from '../../../../services/auth-session.service';

@Component({
  selector: 'register-form',
  imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, ReactiveFormsModule],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private fb = inject(NonNullableFormBuilder);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private jwtTokenService = inject(JwtTokenService);
  private router = inject(Router);
  private authSessionService = inject(AuthSessionService);

  readonly isSubmitting = signal(false);
  readonly serverError = signal('');

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required]],
    avatar: ['', imageUrlValidator],
  }, {
    validators: matchFields('password', 'confirmPassword'),
  });

  onSubmit() {
    if (this.isSubmitting()) return;

    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    const rawValues = this.registerForm.getRawValue();
    const registerUserData: CreateUserDto = {
      email: rawValues.email,
      password: rawValues.password,
      profile: {
        name: rawValues.name,
        avatar: rawValues.avatar || undefined,
      }
    }

    this.usersService.createUser(registerUserData)
      .subscribe({
        next: () => {

          // login after register
          const loginValues: LoginUserDto = registerUserData;
          this.authService.login(loginValues)
            .pipe(
              finalize(() => this.isSubmitting.set(false))
            )
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
                  this.serverError.set("Something went wrong loading your session, try again");
                }
              },
              error: (e: HttpErrorResponse) => {
                if (e.status === 401) {
                  this.serverError.set('Invalid credentials');
                } else {
                  this.serverError.set('Something went wrong during auto-login after register. Please login manually');
                }
              }
            });

        },
        error: (e: HttpErrorResponse) => {
          if(e.status === 400) {
            this.serverError.set("Invalid data");
          } else {
            this.serverError.set("Something went wrong, try again");
          }

          this.isSubmitting.set(false);
        }
      });
  }
}
