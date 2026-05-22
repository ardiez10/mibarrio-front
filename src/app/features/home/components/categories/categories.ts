import { Component } from '@angular/core';

interface Category {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {

  categories: Category[] = [
    {
      icon: '🥖',
      name: 'Alimentación'
    },
    {
      icon: '☕',
      name: 'Hostelería'
    },
    {
      icon: '💇',
      name: 'Servicios'
    },
    {
      icon: '🛍️',
      name: 'Comercio'
    }
  ];
}