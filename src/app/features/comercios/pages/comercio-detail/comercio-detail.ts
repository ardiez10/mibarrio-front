import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { retry } from 'rxjs';

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
      console.error('Id de comercio inválido:', this.route.snapshot.paramMap.get('id'));
      this.error = true;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.api.getComercioById(id).pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        this.comercio = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando comercio:', err);
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
