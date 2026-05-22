import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Categories } from '../../components/categories/categories';
import { OffersSection } from '../../components/offers-section/offers-section';
import { NewsSection } from '../../components/news-section/news-section';

@Component({
  selector: 'app-home',
  imports: [Hero, Categories, OffersSection, NewsSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}