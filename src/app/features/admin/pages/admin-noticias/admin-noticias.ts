import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'app-admin-noticias',
  imports: [],
  templateUrl: './admin-noticias.html',
  styleUrl: './admin-noticias.scss',
})
export class AdminNoticias implements OnInit {
  noticias: Noticia[] = [];
  loading = true;
  error = false;

  constructor(
    private api: Api,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.api.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
