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

  get imageUrl(): string {
    return this.oferta.imagenUrl
      ?? this.oferta.imagen_url
      ?? this.oferta.comercioImagenUrl
      ?? this.oferta.comercio_imagen_url
      ?? '/images/comercio-placeholder.png';
  }

  setFallbackImage(event: Event): void {
    (event.target as HTMLImageElement).src = '/images/comercio-placeholder.png';
  }
}
