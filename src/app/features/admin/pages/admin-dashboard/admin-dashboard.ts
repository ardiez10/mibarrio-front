import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Auth } from '../../../../core/services/auth';
import { Comercio } from '../../../../core/models/comercio.model';
import { Oferta } from '../../../../core/models/oferta.model';

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
    public auth: Auth,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadingPending = true;
    this.pendingError = false;

    const comerciosRequest = this.auth.isAdmin() ? this.api.getComercios() : this.api.getMisComercios();
    const pendingRequest = this.auth.isAdmin() ? this.api.getComerciosPendientes() : this.api.getMisComercios();

    forkJoin({
      comercios: comerciosRequest,
      ofertas: this.api.getOfertas(),
      noticias: this.api.getNoticias(),
      pendingComercios: pendingRequest
    }).subscribe({
      next: ({ comercios, ofertas, noticias, pendingComercios }) => {
        const scopedOfertas = this.scopeOfertas(ofertas, comercios);
        this.stats = {
          comercios: comercios.length,
          ofertasActivas: scopedOfertas.filter(oferta => oferta.activo).length,
          noticias: noticias.length
        };
        this.pendingComercios = this.auth.isAdmin()
          ? pendingComercios
          : pendingComercios.filter(comercio => comercio.estado === 'PENDIENTE');
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
    if (!this.auth.isAdmin()) {
      this.loadDashboard();
      return;
    }

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

  private scopeOfertas(ofertas: Oferta[], comercios: Comercio[]): Oferta[] {
    if (this.auth.isAdmin()) {
      return ofertas;
    }

    const comercioIds = new Set(comercios.map(comercio => comercio.id));
    return ofertas.filter(oferta => comercioIds.has(oferta.comercioId ?? oferta.comercio_id ?? 0));
  }
}
