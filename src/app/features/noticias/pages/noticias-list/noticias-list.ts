import { Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';
import { NoticiaCard } from '../../components/noticia-card/noticia-card';

@Component({
  selector: 'app-noticias-list',
  imports: [NoticiaCard],
  templateUrl: './noticias-list.html',
  styleUrl: './noticias-list.scss',
})
export class NoticiasList implements OnInit {
  noticias: Noticia[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.api.getNoticias().subscribe(data => {
      this.noticias = data;
    });
  }
}