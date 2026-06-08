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
}
