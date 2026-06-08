import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { Api } from '../../../../core/services/api';
import { Auth } from '../../../../core/services/auth';
import { Categoria } from '../../../../core/models/categoria.model';
import { Comercio, Horario } from '../../../../core/models/comercio.model';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-comercios',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-comercios.html',
  styleUrl: './admin-comercios.scss',
})
export class AdminComercios implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  comercios: Comercio[] = [];
  categorias: Categoria[] = [];
  usuariosComercio: Usuario[] = [];
  selectedComercioId: number | null = null;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  private horariosOriginales: Horario[] = [];
  readonly diasSemana = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
  ];

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(150)]],
    telefono: [''],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
    usuarioId: [0, [Validators.required, Validators.min(1)]],
    horarios: this.formBuilder.array([this.createHorarioGroup()])
  });

  constructor(
    private api: Api,
    public auth: Auth,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadComercios();
    this.loadCategorias();
    this.loadUsuarios();
  }

  loadComercios(): void {
    const request = this.auth.isAdmin() ? this.api.getAdminComercios() : this.api.getMisComercios();

    request.subscribe(data => {
      this.comercios = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  loadCategorias(): void {
    this.api.getCategorias().subscribe(data => {
      this.categorias = data.filter(categoria => categoria.activo !== false);
      this.changeDetectorRef.detectChanges();
    });
  }

  loadUsuarios(): void {
    if (!this.auth.isAdmin()) {
      this.usuariosComercio = [];
      this.form.patchValue({ usuarioId: this.auth.session()?.userId ?? 0 });
      return;
    }

    this.api.getUsuarios().subscribe(data => {
      this.usuariosComercio = data.filter(user => user.rolNombre === 'COMERCIO' && user.estado === 'ACTIVO' && user.activo !== false);
      this.changeDetectorRef.detectChanges();
    });
  }

  get horarios(): FormArray {
    return this.form.controls.horarios;
  }

  createHorarioGroup(horario?: Partial<Horario>) {
    return this.formBuilder.nonNullable.group({
      id: [horario?.id ?? 0],
      diaSemana: [horario?.diaSemana ?? 1, [Validators.required, Validators.min(1), Validators.max(7)]],
      horaApertura: [this.formatTimeForInput(horario?.horaApertura) || '09:00', [Validators.required]],
      horaCierre: [this.formatTimeForInput(horario?.horaCierre) || '14:00', [Validators.required]]
    });
  }

  addHorario(): void {
    const usedDays = this.getUsedDays();
    const nextDay = this.diasSemana.find(dia => !usedDays.has(dia.value));

    if (!nextDay) {
      this.errorMessage = 'Ya has añadido todos los días de la semana.';
      return;
    }

    this.horarios.push(this.createHorarioGroup({ diaSemana: nextDay.value }));
  }

  removeHorario(index: number): void {
    this.horarios.removeAt(index);
  }

  canAddHorario(): boolean {
    return this.horarios.length < this.diasSemana.length;
  }

  isDayDisabled(day: number, currentIndex: number): boolean {
    return this.horarios.controls.some((control, index) =>
      index !== currentIndex && Number(control.value.diaSemana) === day
    );
  }

  editComercio(comercio: Comercio): void {
    this.selectedComercioId = comercio.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.patchValue({
      nombre: comercio.nombre,
      direccion: comercio.direccion || '',
      telefono: comercio.telefono || '',
      categoriaId: comercio.categoriaId || 0,
      usuarioId: this.auth.isAdmin() ? (comercio.usuarioId || 0) : (this.auth.session()?.userId ?? 0)
    });
    this.horarios.clear();
    this.horariosOriginales = comercio.horarios ?? [];

    if (this.horariosOriginales.length > 0) {
      this.horariosOriginales.forEach(horario => this.horarios.push(this.createHorarioGroup(horario)));
    } else {
      this.horarios.push(this.createHorarioGroup());
    }

    setTimeout(() => {
      document.querySelector('.admin-comercios-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  startCreate(): void {
    this.selectedComercioId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.patchValue({
      nombre: '',
      direccion: '',
      telefono: '',
      categoriaId: 0,
      usuarioId: this.auth.isAdmin() ? 0 : (this.auth.session()?.userId ?? 0)
    });
    this.horarios.clear();
    this.horarios.push(this.createHorarioGroup());
    this.horariosOriginales = [];
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    const { horarios, ...payload } = this.form.getRawValue();

    const horarioError = this.validateHorarios(horarios);
    if (horarioError) {
      this.errorMessage = horarioError;
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = this.selectedComercioId
      ? this.api.updateComercio(this.selectedComercioId, payload)
      : this.api.createComercio(payload);

    request.pipe(
      switchMap((comercio) => this.syncHorarios(comercio.id, horarios).pipe(map(() => comercio)))
    ).subscribe({
      next: () => {
        this.submitting = false;
        const message = this.selectedComercioId ? 'Comercio actualizado.' : 'Comercio creado.';
        this.startCreate();
        this.successMessage = message;
        this.loadComercios();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido guardar el comercio.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteComercio(comercio: Comercio): void {
    if (!confirm(`¿Desactivar el comercio "${comercio.nombre}"?`)) {
      return;
    }

    this.api.deleteComercio(comercio.id).subscribe({
      next: () => {
        if (this.selectedComercioId === comercio.id) {
          this.startCreate();
      }
        this.successMessage = 'Comercio desactivado.';
        this.loadComercios();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido eliminar el comercio.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  activateComercio(comercio: Comercio): void {
    if (!this.auth.isAdmin()) {
      return;
    }

    this.api.approveComercio(comercio.id).subscribe({
      next: () => {
        this.successMessage = 'Comercio activado.';
        this.loadComercios();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido activar el comercio.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  formatHorario(horario: Horario): string {
    return `${this.diasSemana.find(dia => dia.value === horario.diaSemana)?.label ?? 'Día'} ${this.formatTimeForInput(horario.horaApertura)}-${this.formatTimeForInput(horario.horaCierre)}`;
  }

  private syncHorarios(comercioId: number, horarios: Array<{ id: number; diaSemana: number; horaApertura: string; horaCierre: string }>) {
    const currentIds = horarios
      .map(horario => horario.id)
      .filter(id => id > 0);
    const deleteRequests = this.horariosOriginales
      .filter(horario => !currentIds.includes(horario.id))
      .map(horario => this.api.deleteHorario(horario.id));
    const saveRequests = horarios.map(horario => {
      const payload = {
        diaSemana: Number(horario.diaSemana),
        horaApertura: this.normalizeTime(horario.horaApertura),
        horaCierre: this.normalizeTime(horario.horaCierre)
      };

      return horario.id > 0
        ? this.api.updateHorario(horario.id, payload)
        : this.api.createHorario(comercioId, payload);
    });

    const requests = [...deleteRequests, ...saveRequests];

    return requests.length > 0 ? forkJoin(requests) : of([]);
  }

  private normalizeTime(value: string): string {
    return value.length === 5 ? `${value}:00` : value;
  }

  private formatTimeForInput(value?: string): string {
    return value ? value.slice(0, 5) : '';
  }

  private getUsedDays(): Set<number> {
    return new Set(this.horarios.controls.map(control => Number(control.value.diaSemana)));
  }

  private validateHorarios(horarios: Array<{ diaSemana: number; horaApertura: string; horaCierre: string }>): string {
    const days = horarios.map(horario => Number(horario.diaSemana));
    const uniqueDays = new Set(days);

    if (uniqueDays.size !== days.length) {
      return 'No puedes repetir días en el horario.';
    }

    const invalidTime = horarios.some(horario => horario.horaCierre <= horario.horaApertura);
    if (invalidTime) {
      return 'La hora de cierre debe ser posterior a la hora de apertura.';
    }

    return '';
  }
}
