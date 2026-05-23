import { Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Oferta } from '../../../../core/models/oferta.model';
import { OfertaCard } from '../../components/oferta-card/oferta-card';

@Component({
  selector: 'app-ofertas-list',
  imports: [OfertaCard],
  templateUrl: './ofertas-list.html',
  styleUrl: './ofertas-list.scss',
})
export class OfertasList implements OnInit {
  ofertas: Oferta[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.api.getOfertas().subscribe(data => {
      this.ofertas = data;
    });
  }
}