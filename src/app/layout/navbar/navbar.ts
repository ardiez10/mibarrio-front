import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { APP_BRANDING } from '../../core/config/app-branding';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly branding = APP_BRANDING;
  menuOpen = false;

  constructor(public auth: Auth) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  canAccessPanel(): boolean {
    return this.auth.isAdmin() || this.auth.isComercio();
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
  }
}
