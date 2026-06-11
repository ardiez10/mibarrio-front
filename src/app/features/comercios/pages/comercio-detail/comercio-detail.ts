import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of, retry } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Comercio, Horario } from '../../../../core/models/comercio.model';
import { Oferta } from '../../../../core/models/oferta.model';

interface HorarioDia {
  diaSemana: number;
  dia: string;
  franjas: string[];
}

@Component({
  selector: 'app-comercio-detail',
  imports: [RouterLink],
  templateUrl: './comercio-detail.html',
  styleUrl: './comercio-detail.scss',
})
export class ComercioDetail implements OnInit {

  comercio?: Comercio;
  ofertasActivas: Oferta[] = [];
  loading = true;
  error = false;
  private readonly diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

    forkJoin({
      comercio: this.api.getComercioById(id).pipe(
        retry({ count: 2, delay: 500 })
      ),
      ofertas: this.api.getOfertas().pipe(
        retry({ count: 2, delay: 500 }),
        catchError((err) => {
          console.error('Error cargando ofertas del comercio:', err);
          return of([] as Oferta[]);
        })
      )
    }).subscribe({
      next: ({ comercio, ofertas }) => {
        this.comercio = comercio;
        this.ofertasActivas = this.filterOfertasActivas(ofertas, id)
          .map((oferta) => this.withComercioImage(oferta, comercio));
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

  get horarios(): Horario[] {
    return [...(this.comercio?.horarios ?? [])]
      .sort((a, b) => {
        const dayDiff = (a.diaSemana ?? 99) - (b.diaSemana ?? 99);

        if (dayDiff !== 0) {
          return dayDiff;
        }

        return (a.horaApertura ?? '').localeCompare(b.horaApertura ?? '');
      });
  }

  get horariosAgrupados(): HorarioDia[] {
    const grouped = new Map<number, HorarioDia>();

    this.horarios.forEach((horario) => {
      const diaSemana = horario.diaSemana ?? 0;

      if (!grouped.has(diaSemana)) {
        grouped.set(diaSemana, {
          diaSemana,
          dia: this.formatDiaSemana(diaSemana),
          franjas: []
        });
      }

      grouped.get(diaSemana)?.franjas.push(
        `${this.formatHora(horario.horaApertura)} - ${this.formatHora(horario.horaCierre)}`
      );
    });

    return Array.from(grouped.values())
      .sort((a, b) => a.diaSemana - b.diaSemana);
  }

  formatDiaSemana(diaSemana?: number): string {
    if (!diaSemana || diaSemana < 1 || diaSemana > this.diasSemana.length) {
      return 'Día';
    }

    return this.diasSemana[diaSemana - 1];
  }

  formatHora(hora?: string): string {
    return hora ? hora.slice(0, 5) : '-';
  }

  getOfertaImage(oferta: Oferta): string {
    return oferta.imagenUrl
      ?? oferta.imagen_url
      ?? oferta.comercioImagenUrl
      ?? oferta.comercio_imagen_url
      ?? this.comercio?.imagenUrl
      ?? '/images/comercio-placeholder.png';
  }

  getOfertaBadge(oferta: Oferta): string {
    if (!oferta.fechaFin) {
      return 'Oferta activa';
    }

    return `Hasta ${new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short'
    }).format(new Date(`${oferta.fechaFin}T00:00:00`))}`;
  }

  private filterOfertasActivas(ofertas: Oferta[], comercioId: number): Oferta[] {
    return ofertas
      .filter((oferta) => oferta.activo === true && (oferta.comercioId ?? oferta.comercio_id) === comercioId)
      .sort((a, b) => (a.fechaFin ?? '9999-12-31').localeCompare(b.fechaFin ?? '9999-12-31'));
  }

  private withComercioImage(oferta: Oferta, comercio: Comercio): Oferta {
    return {
      ...oferta,
      comercioImagenUrl: oferta.comercioImagenUrl ?? oferta.comercio_imagen_url ?? comercio.imagenUrl
    };
  }
}
