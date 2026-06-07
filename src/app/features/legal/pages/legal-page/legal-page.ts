import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.scss',
})
export class LegalPage {
  @Input({ required: true }) kicker = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) intro = '';
}
