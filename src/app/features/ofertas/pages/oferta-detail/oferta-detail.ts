import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { retry } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-oferta-detail',
  imports: [RouterLink],
  templateUrl: './oferta-detail.html',
  styleUrl: './oferta-detail.scss',
})
export class OfertaDetail implements OnInit {
  oferta?: Oferta;
  comercio?: Comercio;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getOfertaById(id).pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.oferta = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.loadComercioAsociado(data);
      },
      error: (err) => {
        console.error('Error cargando oferta:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  setFallbackImage(event: Event): void {
    (event.target as HTMLImageElement).src = '/images/comercio-placeholder.png';
  }

  get comercioId(): number | undefined {
    return this.oferta?.comercioId ?? this.oferta?.comercio_id;
  }

  get comercioNombre(): string {
    return this.comercio?.nombre
      ?? this.oferta?.comercioNombre
      ?? this.oferta?.comercio_nombre
      ?? 'Comercio';
  }

  get fechaFinFormateada(): string {
    const fechaFin = this.oferta?.fechaFin;

    if (!fechaFin) {
      return 'Sin fecha de fin indicada';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(fechaFin));
  }

  private loadComercioAsociado(oferta: Oferta): void {
    const comercioId = oferta.comercioId ?? oferta.comercio_id;

    if (!comercioId) {
      return;
    }

    this.api.getComercioById(comercioId).subscribe({
      next: (comercio) => {
        this.comercio = comercio;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando comercio asociado:', err);
      }
    });
  }
}
