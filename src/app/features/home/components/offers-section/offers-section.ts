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
}
