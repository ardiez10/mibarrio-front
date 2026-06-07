import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  searchTerm = '';

  constructor(private router: Router) {}

  search(): void {
    const query = this.searchTerm.trim();

    void this.router.navigate(['/comercios'], {
      queryParams: query ? { q: query } : {}
    });
  }
}
