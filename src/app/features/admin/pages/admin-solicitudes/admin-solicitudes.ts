import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';

@Component({
  selector: 'app-admin-solicitudes',
  imports: [],
  templateUrl: './admin-solicitudes.html',
  styleUrl: './admin-solicitudes.scss',
})
export class AdminSolicitudes implements OnInit {
  solicitudes: Comercio[] = [];
  loading = true;
  errorMessage = '';
  actionMessage = '';
  processingId: number | null = null;

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getComerciosPendientes().subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se han podido cargar las solicitudes.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  approve(comercio: Comercio): void {
    this.processingId = comercio.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.approveComercio(comercio.id).subscribe({
      next: () => {
        this.actionMessage = `Solicitud aprobada: ${comercio.nombre}`;
        this.processingId = null;
        this.loadSolicitudes();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido aprobar la solicitud.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  reject(comercio: Comercio): void {
    this.processingId = comercio.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.rejectComercio(comercio.id).subscribe({
      next: () => {
        this.actionMessage = `Solicitud rechazada: ${comercio.nombre}`;
        this.processingId = null;
        this.loadSolicitudes();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido rechazar la solicitud.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
