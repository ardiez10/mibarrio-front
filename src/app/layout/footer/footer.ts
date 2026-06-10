import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_BRANDING } from '../../core/config/app-branding';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly branding = APP_BRANDING;
  isDarkMode = false;

  ngOnInit(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    this.isDarkMode = localStorage.getItem('mibarrio-theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('mibarrio-theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('theme-dark', this.isDarkMode);
  }
}
