import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, retry } from 'rxjs';

import { APP_BRANDING } from '../../../../core/config/app-branding';
import { Api } from '../../../../core/services/api';
import { Categoria } from '../../../../core/models/categoria.model';
import { Comercio } from '../../../../core/models/comercio.model';
import { Oferta } from '../../../../core/models/oferta.model';
import { OfertaCard } from '../../components/oferta-card/oferta-card';

@Component({
  selector: 'app-ofertas-list',
  imports: [OfertaCard, FormsModule],
  templateUrl: './ofertas-list.html',
  styleUrl: './ofertas-list.scss',
})
export class OfertasList implements OnInit {
  readonly branding = APP_BRANDING;
  ofertas: Oferta[] = [];
  loading = true;
  error = false;
  searchTerm = '';
  selectedCategory = '';

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('q') ?? '';
      this.selectedCategory = params.get('categoria') ?? '';
      this.changeDetectorRef.detectChanges();
    });
    this.loadOfertas();
  }

  get filteredOfertas(): Oferta[] {
    const search = this.normalizeText(this.searchTerm);
    const category = this.normalizeText(this.selectedCategory);

    return this.ofertas.filter((oferta) => {
      const comercioNombre = oferta.comercioNombre ?? oferta.comercio_nombre ?? '';
      const titulo = this.normalizeText(oferta.titulo);
      const descripcion = this.normalizeText(oferta.descripcion);
      const comercio = this.normalizeText(comercioNombre);
      const ofertaCategoria = this.normalizeText(oferta.categoria ?? '');
      const matchesSearch =
        !search ||
        titulo.includes(search) ||
        descripcion.includes(search) ||
        comercio.includes(search);

      const matchesCategory = !category || ofertaCategoria === category;

      return matchesSearch && matchesCategory;
    });
  }

  get availableCategoryNames(): string[] {
    const names = new Set<string>();

    this.ofertas.forEach((oferta) => {
      if (oferta.categoria?.trim()) {
        names.add(oferta.categoria.trim());
      }
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b, 'es'));
  }

  get hasActiveFilters(): boolean {
    return this.searchTerm.trim().length > 0 || this.selectedCategory.trim().length > 0;
  }

  loadOfertas(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      ofertas: this.api.getOfertas().pipe(retry({ count: 2, delay: 500 })),
      comercios: this.api.getComercios().pipe(retry({ count: 2, delay: 500 })),
      categorias: this.api.getCategorias().pipe(retry({ count: 2, delay: 500 }))
    }).subscribe({
      next: ({ ofertas, comercios, categorias }) => {
        this.ofertas = ofertas
          .filter((oferta) => oferta.activo === true)
          .map((oferta) => this.hydrateOfertaCategory(oferta, comercios, categorias));

        if (this.selectedCategory && !this.availableCategoryNames.includes(this.selectedCategory)) {
          this.selectedCategory = '';
          void this.router.navigate(['/ofertas'], {
            queryParams: this.searchTerm.trim() ? { q: this.searchTerm.trim() } : {}
          });
        }

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando ofertas:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const queryParams: Record<string, string> = {};

    if (this.searchTerm.trim()) {
      queryParams['q'] = this.searchTerm.trim();
    }

    if (this.selectedCategory.trim()) {
      queryParams['categoria'] = this.selectedCategory.trim();
    }

    void this.router.navigate(['/ofertas'], { queryParams });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    void this.router.navigate(['/ofertas']);
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private hydrateOfertaCategory(oferta: Oferta, comercios: Comercio[], categorias: Categoria[]): Oferta {
    if (oferta.categoria?.trim()) {
      return oferta;
    }

    const comercioId = oferta.comercioId ?? oferta.comercio_id;
    const comercio = comercios.find((item) => item.id === comercioId);
    const categoriaNombre = this.resolveComercioCategoryName(comercio, categorias);

    if (!categoriaNombre) {
      return oferta;
    }

    return {
      ...oferta,
      categoria: categoriaNombre
    };
  }

  private resolveComercioCategoryName(comercio: Comercio | undefined, categorias: Categoria[]): string {
    if (comercio?.categoria?.trim()) {
      return comercio.categoria.trim();
    }

    if (!comercio?.categoriaId) {
      return '';
    }

    return categorias.find((categoria) => categoria.id === comercio.categoriaId)?.nombre?.trim() ?? '';
  }
}
