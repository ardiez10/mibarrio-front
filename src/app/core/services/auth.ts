import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { Api } from './api';
import { AuthSession, LoginRequest, SignupRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly storageKey = 'mibarrio_auth';
  private readonly router = inject(Router);
  private readonly api = inject(Api);

  private readonly sessionState = signal<AuthSession | null>(this.loadStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly isLoggedIn = computed(() => this.sessionState() !== null);
  readonly isAdmin = computed(() => this.sessionState()?.rol === 'ADMIN');
  readonly isComercio = computed(() => this.sessionState()?.rol === 'COMERCIO');

  login(payload: LoginRequest) {
    return this.api.login(payload).pipe(
      tap((response) => {
        const session: AuthSession = {
          token: response.token,
          email: response.email,
          rol: response.rol
        };
        this.sessionState.set(session);
        localStorage.setItem(this.storageKey, JSON.stringify(session));
      })
    );
  }

  signup(payload: SignupRequest) {
    return this.api.signup(payload);
  }

  logout(): void {
    this.sessionState.set(null);
    localStorage.removeItem(this.storageKey);
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return this.sessionState()?.token ?? null;
  }

  private loadStoredSession(): AuthSession | null {
    const rawSession = localStorage.getItem(this.storageKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
