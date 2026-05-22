import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';

@Component({
  selector: 'app-comercio-detail',
  imports: [RouterLink],
  templateUrl: './comercio-detail.html',
  styleUrl: './comercio-detail.scss',
})
export class ComercioDetail implements OnInit {

  comercio?: Comercio;

  constructor(
    private route: ActivatedRoute,
    private api: Api
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getComercioById(id).subscribe(data => {
      this.comercio = data;
    });
  }
}