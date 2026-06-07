import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { retry } from 'rxjs';

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
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      console.error('Id de noticia inválido:', this.route.snapshot.paramMap.get('id'));
      this.error = true;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.api.getNoticiaById(id).pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.noticia = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando noticia:', err);
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
