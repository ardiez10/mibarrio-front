import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_BRANDING } from '../../../../core/config/app-branding';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly branding = APP_BRANDING;
  searchTerm = '';

  constructor(private router: Router) {}

  search(): void {
    const query = this.searchTerm.trim();

    void this.router.navigate(['/comercios'], {
      queryParams: query ? { q: query } : {}
    });
  }
}
