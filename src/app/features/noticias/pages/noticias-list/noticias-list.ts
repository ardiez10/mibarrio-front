import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { retry } from 'rxjs';

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
  loading = true;
  error = false;

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNoticias();
  }

  loadNoticias(): void {
    this.loading = true;
    this.error = false;

    this.api.getNoticias().pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.noticias = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando noticias:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
