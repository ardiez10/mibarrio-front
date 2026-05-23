import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

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

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.api.getOfertas().subscribe(data => {
      this.ofertas = data
        .filter(oferta => oferta.activo)
        .slice(0, 3);
    });
  }
}