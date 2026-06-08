import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { retry } from 'rxjs';

import { APP_BRANDING } from '../../../../core/config/app-branding';
import { Api } from '../../../../core/services/api';
import { Categoria } from '../../../../core/models/categoria.model';
import { Comercio } from '../../../../core/models/comercio.model';

import { ComercioCard } from '../../components/comercio-card/comercio-card';

@Component({
  selector: 'app-comercios-list',
  imports: [ComercioCard, FormsModule],
  templateUrl: './comercios-list.html',
  styleUrl: './comercios-list.scss',
})
export class ComerciosList implements OnInit {
  readonly branding = APP_BRANDING;

  comercios: Comercio[] = [];
  categorias: Categoria[] = [];
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
    this.loadCategorias();
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('q') ?? '';
      this.selectedCategory = params.get('categoria') ?? '';
    });
    this.loadComercios();
  }

  get filteredComercios(): Comercio[] {
    const search = this.searchTerm.trim().toLowerCase();
    const category = this.selectedCategory.trim().toLowerCase();

    return this.comercios.filter((comercio) => {
      const matchesSearch =
        !search ||
        comercio.nombre.toLowerCase().includes(search) ||
        comercio.direccion?.toLowerCase().includes(search);

      const matchesCategory =
        !category || comercio.categoria?.toLowerCase() === category;

      return matchesSearch && matchesCategory;
    });
  }

  get availableCategoryNames(): string[] {
    const names = new Set<string>();

    this.categorias.forEach((categoria) => {
      if (categoria.nombre?.trim()) {
        names.add(categoria.nombre.trim());
      }
    });

    this.comercios.forEach((comercio) => {
      if (comercio.categoria?.trim()) {
        names.add(comercio.categoria.trim());
      }
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b, 'es'));
  }

  get hasActiveFilters(): boolean {
    return this.searchTerm.trim().length > 0 || this.selectedCategory.trim().length > 0;
  }

  loadComercios(): void {
    this.loading = true;
    this.error = false;

    this.api.getComercios().pipe(
      retry({ count: 2, delay: 500 })
    ).subscribe({
      next: (data) => {
        console.log('Comercios obtenidos:', data);
        this.comercios = data;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando comercios:', err);
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadCategorias(): void {
    this.api.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorias:', err);
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

    void this.router.navigate(['/comercios'], { queryParams });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    void this.router.navigate(['/comercios']);
  }
}
