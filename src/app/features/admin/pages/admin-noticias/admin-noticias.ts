import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'app-admin-noticias',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-noticias.html',
  styleUrl: './admin-noticias.scss',
})
export class AdminNoticias implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  noticias: Noticia[] = [];
  loading = true;
  error = false;
  selectedNoticiaId: number | null = null;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(500)]],
    descripcion: ['', [Validators.required]],
    fuente: [''],
    url: [''],
    imagenUrl: [''],
    fechaPublicacion: ['']
  });

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNoticias();
  }

  loadNoticias(): void {
    this.loading = true;
    this.error = false;

    this.api.getAdminNoticias().subscribe({
      next: (data) => {
        this.noticias = data;
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

  startCreate(): void {
    this.selectedNoticiaId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({
      titulo: '',
      descripcion: '',
      fuente: '',
      url: '',
      imagenUrl: '',
      fechaPublicacion: ''
    });
  }

  editNoticia(noticia: Noticia): void {
    this.selectedNoticiaId = noticia.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.setValue({
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      fuente: noticia.fuente || '',
      url: noticia.url || '',
      imagenUrl: noticia.imagenUrl || noticia.imagen_url || '',
      fechaPublicacion: noticia.fechaPublicacion || noticia.fecha_publicacion || ''
    });

    setTimeout(() => {
      document.querySelector('.admin-noticias-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const request = this.selectedNoticiaId
      ? this.api.updateNoticia(this.selectedNoticiaId, payload)
      : this.api.createNoticia(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        const message = this.selectedNoticiaId ? 'Noticia actualizada.' : 'Noticia creada.';
        this.startCreate();
        this.successMessage = message;
        this.loadNoticias();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido guardar la noticia.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deactivateNoticia(noticia: Noticia): void {
    if (!confirm(`¿Ocultar la noticia "${noticia.titulo}"?`)) {
      return;
    }

    this.api.deleteNoticia(noticia.id).subscribe({
      next: () => {
        this.successMessage = 'Noticia desactivada.';
        this.loadNoticias();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido desactivar la noticia.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  activateNoticia(noticia: Noticia): void {
    this.api.activateNoticia(noticia.id).subscribe({
      next: () => {
        this.successMessage = 'Noticia activada.';
        this.loadNoticias();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido activar la noticia.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
