import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
import { Auth } from '../../../../core/services/auth';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  imports: [],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss',
})
export class AdminUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  errorMessage = '';
  actionMessage = '';
  processingId: number | null = null;

  constructor(
    private api: Api,
    public auth: Auth,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se han podido cargar los usuarios.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  approve(usuario: Usuario): void {
    this.processingId = usuario.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.approveUsuario(usuario.id).subscribe({
      next: () => {
        this.actionMessage = `Usuario aprobado: ${usuario.email}`;
        this.processingId = null;
        this.loadUsuarios();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido aprobar el usuario.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  reject(usuario: Usuario): void {
    if (!confirm(`¿Desactivar o rechazar el usuario "${usuario.email}"?`)) {
      return;
    }

    this.processingId = usuario.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.rejectUsuario(usuario.id).subscribe({
      next: () => {
        this.actionMessage = `Usuario rechazado: ${usuario.email}`;
        this.processingId = null;
        this.loadUsuarios();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido rechazar el usuario.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  delete(usuario: Usuario): void {
    if (!confirm(`¿Eliminar el usuario "${usuario.email}"?`)) {
      return;
    }

    this.processingId = usuario.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.actionMessage = `Usuario eliminado: ${usuario.email}`;
        this.processingId = null;
        this.loadUsuarios();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido eliminar el usuario.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deactivate(usuario: Usuario): void {
    if (!confirm(`¿Desactivar el usuario "${usuario.email}"?`)) {
      return;
    }

    this.processingId = usuario.id;
    this.actionMessage = '';
    this.errorMessage = '';

    this.api.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.actionMessage = `Usuario desactivado: ${usuario.email}`;
        this.processingId = null;
        this.loadUsuarios();
      },
      error: (err) => {
        this.errorMessage = err?.error?.details?.[0] || 'No se ha podido desactivar el usuario.';
        this.processingId = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  canReview(usuario: Usuario): boolean {
    return !this.isCurrentUser(usuario) && usuario.estado === 'PENDIENTE';
  }

  canActivate(usuario: Usuario): boolean {
    return !this.isCurrentUser(usuario) && usuario.estado !== 'PENDIENTE' && (usuario.estado !== 'ACTIVO' || usuario.activo === false);
  }

  canDeactivate(usuario: Usuario): boolean {
    return !this.isCurrentUser(usuario) && usuario.estado !== 'PENDIENTE' && usuario.estado === 'ACTIVO' && usuario.activo !== false;
  }

  canDelete(usuario: Usuario): boolean {
    return !this.isCurrentUser(usuario);
  }

  isCurrentUser(usuario: Usuario): boolean {
    return usuario.id === this.auth.session()?.userId;
  }

  formatDateTime(value?: string): string {
    if (!value) {
      return '-';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }
}
