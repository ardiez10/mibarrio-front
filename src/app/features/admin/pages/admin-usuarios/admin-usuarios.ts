import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Api } from '../../../../core/services/api';
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

  canReview(usuario: Usuario): boolean {
    return usuario.estado === 'PENDIENTE';
  }
}
