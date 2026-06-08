import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Auth } from '../../../../core/services/auth';
import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-admin-ofertas',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-ofertas.html',
  styleUrl: './admin-ofertas.scss',
})
export class AdminOfertas implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  ofertas: Oferta[] = [];
  comercios: Comercio[] = [];
  selectedOfertaId: number | null = null;
  loading = true;
  error = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    comercioId: [0, [Validators.required, Validators.min(1)]],
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    fechaFin: ['', [Validators.required]]
  });

  constructor(
    private api: Api,
    private auth: Auth,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOfertas();
    this.loadComercios();
  }

  get managedComercios(): Comercio[] {
    const session = this.auth.session();

    if (!session) {
      return [];
    }

    if (this.auth.isAdmin()) {
      return this.comercios;
    }

    return this.comercios.filter((comercio) => comercio.usuarioEmail === session.email);
  }

  loadOfertas(): void {
    this.loading = true;
    this.error = false;

    this.api.getOfertas().subscribe({
      next: (data) => {
        this.ofertas = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadComercios(): void {
    const request = this.auth.isAdmin() ? this.api.getComercios() : this.api.getMisComercios();

    request.subscribe({
      next: (comercios) => {
        this.comercios = comercios;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se han podido cargar los comercios disponibles para las ofertas.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  startCreate(): void {
    this.selectedOfertaId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({
      comercioId: this.managedComercios.length === 1 ? this.managedComercios[0].id : 0,
      titulo: '',
      descripcion: '',
      fechaFin: ''
    });
  }

  editOferta(oferta: Oferta): void {
    this.selectedOfertaId = oferta.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.setValue({
      comercioId: oferta.comercioId ?? oferta.comercio_id ?? 0,
      titulo: oferta.titulo,
      descripcion: oferta.descripcion,
      fechaFin: oferta.fechaFin ?? ''
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

    const { comercioId, ...payload } = this.form.getRawValue();
    const request = this.selectedOfertaId
      ? this.api.updateOferta(this.selectedOfertaId, payload)
      : this.api.createOferta(comercioId, payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = this.selectedOfertaId ? 'Oferta actualizada.' : 'Oferta creada.';
        this.startCreate();
        this.loadOfertas();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido guardar la oferta.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteOferta(oferta: Oferta): void {
    if (!confirm(`¿Desactivar la oferta "${oferta.titulo}"?`)) {
      return;
    }

    this.api.deleteOferta(oferta.id).subscribe({
      next: () => {
        if (this.selectedOfertaId === oferta.id) {
          this.startCreate();
        }
        this.successMessage = 'Oferta desactivada.';
        this.loadOfertas();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido desactivar la oferta.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  formatFechaFin(fechaFin?: string): string {
    if (!fechaFin) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(fechaFin));
  }
}
