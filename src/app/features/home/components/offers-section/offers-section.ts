import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-offers-section',
  imports: [RouterLink],
  templateUrl: './offers-section.html',
  styleUrl: './offers-section.scss',
})
export class OffersSection implements OnInit {
  ofertas: Oferta[] = [];
  loading = true;
  error = false;
  private readonly daysBeforeEndingSoon = 2;
  private readonly millisecondsPerDay = 24 * 60 * 60 * 1000;

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.api.getOfertas().pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.ofertas = data
          .filter((oferta) => oferta.activo === true)
          .slice(0, 3);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando ofertas destacadas:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getOfferBadge(oferta: Oferta): string {
    const daysUntilEnd = this.getDaysUntilEnd(oferta.fechaFin);

    if (daysUntilEnd === null) {
      return 'Promoción activa';
    }

    if (daysUntilEnd <= this.daysBeforeEndingSoon) {
      return 'Acaba pronto';
    }

    return `Hasta ${this.formatDate(oferta.fechaFin)}`;
  }

  isEndingSoon(oferta: Oferta): boolean {
    const daysUntilEnd = this.getDaysUntilEnd(oferta.fechaFin);

    return daysUntilEnd !== null && daysUntilEnd <= this.daysBeforeEndingSoon;
  }

  private getDaysUntilEnd(fechaFin?: string): number | null {
    if (!fechaFin) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(`${fechaFin}T00:00:00`);
    endDate.setHours(0, 0, 0, 0);

    return Math.ceil((endDate.getTime() - today.getTime()) / this.millisecondsPerDay);
  }

  private formatDate(fechaFin?: string): string {
    if (!fechaFin) {
      return '';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(`${fechaFin}T00:00:00`));
  }
}
