import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'app-noticia-detail',
  imports: [RouterLink],
  templateUrl: './noticia-detail.html',
  styleUrl: './noticia-detail.scss',
})
export class NoticiaDetail implements OnInit {
  noticia?: Noticia;

  constructor(
    private route: ActivatedRoute,
    private api: Api
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getNoticiaById(id).subscribe(data => {
      this.noticia = data;
    });
  }
}