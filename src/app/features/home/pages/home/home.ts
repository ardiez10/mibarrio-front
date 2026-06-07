import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Categories } from '../../components/categories/categories';
import { Hero } from '../../components/hero/hero';
import { NewsSection } from '../../components/news-section/news-section';
import { OffersSection } from '../../components/offers-section/offers-section';

@Component({
  selector: 'app-home',
  imports: [Hero, Categories, OffersSection, NewsSection, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
