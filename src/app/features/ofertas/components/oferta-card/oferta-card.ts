import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-oferta-card',
  imports: [RouterLink],
  templateUrl: './oferta-card.html',
  styleUrl: './oferta-card.scss',
})
export class OfertaCard {
  @Input({ required: true }) oferta!: Oferta;

  setFallbackImage(event: Event): void {
    (event.target as HTMLImageElement).src = '/images/comercio-placeholder.png';
  }
}
