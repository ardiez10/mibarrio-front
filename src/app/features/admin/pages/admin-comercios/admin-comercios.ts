import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Api } from '../../../../core/services/api';
import { Categoria } from '../../../../core/models/categoria.model';
import { Comercio } from '../../../../core/models/comercio.model';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-comercios',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-comercios.html',
  styleUrl: './admin-comercios.scss',
})
export class AdminComercios implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  comercios: Comercio[] = [];
  categorias: Categoria[] = [];
  usuariosComercio: Usuario[] = [];
  selectedComercioId: number | null = null;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(150)]],
    telefono: [''],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
    usuarioId: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadComercios();
    this.loadCategorias();
    this.loadUsuarios();
  }

  loadComercios(): void {
    this.api.getComercios().subscribe(data => {
      this.comercios = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  loadCategorias(): void {
    this.api.getCategorias().subscribe(data => {
      this.categorias = data.filter(categoria => categoria.activo !== false);
      this.changeDetectorRef.detectChanges();
    });
  }

  loadUsuarios(): void {
    this.api.getUsuarios().subscribe(data => {
      this.usuariosComercio = data.filter(user => user.rolNombre === 'COMERCIO' && user.estado === 'ACTIVO');
      this.changeDetectorRef.detectChanges();
    });
  }

  editComercio(comercio: Comercio): void {
    this.selectedComercioId = comercio.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.setValue({
      nombre: comercio.nombre,
      direccion: comercio.direccion || '',
      telefono: comercio.telefono || '',
      categoriaId: comercio.categoriaId || 0,
      usuarioId: comercio.usuarioId || 0
    });
  }

  startCreate(): void {
    this.selectedComercioId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({
      nombre: '',
      direccion: '',
      telefono: '',
      categoriaId: 0,
      usuarioId: 0
    });
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.form.getRawValue();
    const request = this.selectedComercioId
      ? this.api.updateComercio(this.selectedComercioId, payload)
      : this.api.createComercio(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = this.selectedComercioId ? 'Comercio actualizado.' : 'Comercio creado.';
        this.startCreate();
        this.loadComercios();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido guardar el comercio.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteComercio(comercio: Comercio): void {
    if (!confirm(`¿Eliminar el comercio "${comercio.nombre}"?`)) {
      return;
    }

    this.api.deleteComercio(comercio.id).subscribe({
      next: () => {
        if (this.selectedComercioId === comercio.id) {
          this.startCreate();
        }
        this.loadComercios();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido eliminar el comercio.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
