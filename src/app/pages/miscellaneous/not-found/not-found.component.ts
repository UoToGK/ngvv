import { DyMenuService } from 'src/framework/theme/public_api';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private menuService: DyMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
