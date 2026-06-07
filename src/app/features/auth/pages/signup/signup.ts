import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Auth } from '../../../../core/services/auth';
import { Api } from '../../../../core/services/api';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly api = inject(Api);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  loading = false;
  categorias: Categoria[] = [];

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/)]],
    comercioNombre: ['', [Validators.required, Validators.maxLength(100)]],
    comercioDireccion: ['', [Validators.required, Validators.maxLength(150)]],
    comercioTelefono: ['', [Validators.pattern(/^\+?[0-9\s]{9,15}$/)]],
    categoriaId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.api.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias.filter(categoria => categoria.activo !== false);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.signup(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        this.form.reset();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido completar el registro.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
