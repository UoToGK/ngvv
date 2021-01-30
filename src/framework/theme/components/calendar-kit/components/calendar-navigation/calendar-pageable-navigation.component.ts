

import { Component, EventEmitter, Output } from '@angular/core';

import { DyLayoutDirectionService } from '../../../../services/direction.service';


@Component({
  selector: 'dy-calendar-pageable-navigation',
  styleUrls: ['./calendar-pageable-navigation.component.scss'],
  template: `
    <button dyButton (click)="prev.emit()" ghost status="basic" class="prev-month">
      <dy-icon [icon]="isLtr ? 'chevron-left-outline' : 'chevron-right-outline'" pack="nebular-essentials"></dy-icon>
    </button>
    <button dyButton (click)="next.emit()" ghost status="basic" class="next-month">
      <dy-icon [icon]="isLtr ? 'chevron-right-outline' : 'chevron-left-outline'" pack="nebular-essentials"></dy-icon>
    </button>
  `,
})
export class DyCalendarPageableNavigationComponent<D> {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  constructor(private directionService: DyLayoutDirectionService) {
  }

  get isLtr(): boolean {
    return this.directionService.isLtr();
  }
}
