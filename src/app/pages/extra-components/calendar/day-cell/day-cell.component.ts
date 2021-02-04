import { Component } from '@angular/core';
import { DyCalendarDayCellComponent } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-day-cell',
  templateUrl: 'day-cell.component.html',
  styleUrls: ['day-cell.component.scss'],
  host: { '(click)': 'onClick()', 'class': 'day-cell' },
})
export class DayCellComponent extends DyCalendarDayCellComponent<Date> {
}
