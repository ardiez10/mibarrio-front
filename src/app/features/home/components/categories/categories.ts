import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface Category {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-categories',
  imports: [MatIconModule, RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {

  categories: Category[] = [
    {
      icon: 'bakery_dining',
      name: 'Alimentación'
    },
    {
      icon: 'local_cafe',
      name: 'Hostelería'
    },
    {
      icon: 'content_cut',
      name: 'Servicios'
    },
    {
      icon: 'storefront',
      name: 'Comercio'
    }
  ];
}
