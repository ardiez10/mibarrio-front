import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  errorMessage = '';
  loading = false;

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.auth.isAdmin() || this.auth.isComercio() ? '/admin' : '/');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getLoginErrorMessage(err);
      }
    });
  }

  private getLoginErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = error.error?.details?.[0] || error.error?.message || error.error?.error;

      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return 'No existe una cuenta aprobada con esos datos o todavía está pendiente de revisión.';
      }

      if (backendMessage) {
        return backendMessage;
      }
    }

    return 'No se ha podido iniciar sesión. Revisa tus datos e inténtalo de nuevo.';
  }
}
