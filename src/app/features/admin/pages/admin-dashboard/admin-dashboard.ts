import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  pendingComercios: Comercio[] = [];
  loadingPending = true;
  pendingError = false;
  stats = {
    comercios: 0,
    ofertasActivas: 0,
    noticias: 0
  };

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadingPending = true;
    this.pendingError = false;

    forkJoin({
      comercios: this.api.getComercios(),
      ofertas: this.api.getOfertas(),
      noticias: this.api.getNoticias(),
      pendingComercios: this.api.getComerciosPendientes()
    }).subscribe({
      next: ({ comercios, ofertas, noticias, pendingComercios }) => {
        this.stats = {
          comercios: comercios.length,
          ofertasActivas: ofertas.filter(oferta => oferta.activo).length,
          noticias: noticias.length
        };
        this.pendingComercios = pendingComercios;
        this.loadingPending = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.pendingError = true;
        this.loadingPending = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadPendingComercios(): void {
    this.loadingPending = true;
    this.pendingError = false;

    this.api.getComerciosPendientes().subscribe({
      next: (comercios) => {
        this.pendingComercios = comercios;
        this.loadingPending = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.pendingError = true;
        this.loadingPending = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  approveComercio(comercioId: number): void {
    this.api.approveComercio(comercioId).subscribe({
      next: () => this.loadPendingComercios()
    });
  }

  rejectComercio(comercioId: number): void {
    this.api.rejectComercio(comercioId).subscribe({
      next: () => this.loadPendingComercios()
    });
  }
}
