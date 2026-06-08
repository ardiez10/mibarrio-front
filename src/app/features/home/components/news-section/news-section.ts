import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'app-news-section',
  imports: [RouterLink],
  templateUrl: './news-section.html',
  styleUrl: './news-section.scss',
})
export class NewsSection implements OnInit {

  noticias: Noticia[] = [];
  loading = true;
  error = false;

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.api.getNoticias().pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.noticias = data.slice(0, 2);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando noticias destacadas:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  setFallbackImage(event: Event): void {
    (event.target as HTMLImageElement).src = '/images/comercio-placeholder.png';
  }
}
