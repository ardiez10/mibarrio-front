import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Comercio } from '../../../../core/models/comercio.model';

@Component({
  selector: 'app-comercio-card',
  imports: [RouterLink],
  templateUrl: './comercio-card.html',
  styleUrl: './comercio-card.scss',
})
export class ComercioCard {
  @Input({ required: true }) comercio!: Comercio;
}