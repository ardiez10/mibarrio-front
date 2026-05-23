import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Api } from '../../../../core/services/api';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
  selector: 'app-oferta-detail',
  imports: [RouterLink],
  templateUrl: './oferta-detail.html',
  styleUrl: './oferta-detail.scss',
})
export class OfertaDetail implements OnInit {
  oferta?: Oferta;

  constructor(
    private route: ActivatedRoute,
    private api: Api
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getOfertaById(id).subscribe(data => {
      this.oferta = data;
    });
  }
}