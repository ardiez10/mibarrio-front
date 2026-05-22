import { Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Comercio } from '../../../../core/models/comercio.model';

import { ComercioCard } from '../../components/comercio-card/comercio-card';

@Component({
  selector: 'app-comercios-list',
  imports: [ComercioCard],
  templateUrl: './comercios-list.html',
  styleUrl: './comercios-list.scss',
})
export class ComerciosList implements OnInit {

  comercios: Comercio[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {

    this.api.getComercios().subscribe(data => {
      this.comercios = data;
    });
  }
}