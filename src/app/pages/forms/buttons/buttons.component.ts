import { Component } from '@angular/core';
import { DyComponentShape, DyComponentSize, DyComponentStatus, DyThemeService } from 'src/framework/theme/public_api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./buttons.component.scss'],
  templateUrl: './buttons.component.html',
})
export class ButtonsComponent {
  public constructor(private readonly themeService: DyThemeService) {
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(map(theme => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }));
  }

  public readonly materialTheme$: Observable<boolean>;

  public readonly statuses: DyComponentStatus[] = [ 'primary', 'success', 'info', 'warning', 'danger' ];
  public readonly shapes: DyComponentShape[] = [ 'rectangle', 'semi-round', 'round' ];
  public readonly sizes: DyComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];

}
