import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Api } from '../../../../core/services/api';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-offers-section',
  imports: [CommonModule],
  templateUrl: './offers-section.html',
  styleUrl: './offers-section.scss',
})
export class OffersSection implements OnInit {

  ofertas: Oferta[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {

    this.api.getOfertas().subscribe(data => {
      this.ofertas = data;
    });
  }
}