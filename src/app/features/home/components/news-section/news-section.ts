import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'app-news-section',
  imports: [CommonModule],
  templateUrl: './news-section.html',
  styleUrl: './news-section.scss',
})
export class NewsSection implements OnInit {

  noticias: Noticia[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {

    this.api.getNoticias().subscribe(data => {
      this.noticias = data;
    });
  }
}