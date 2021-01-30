

import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';


@Component({
  selector: 'dy-calendar-picker-row',
  styles: [`
    :host {
      display: flex;
      justify-content: space-between;
    }
  `],
  template: '<ng-template></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarPickerRowComponent<D, T> implements OnChanges {
  @Input() row: D[];
  @Input() selectedValue: T;
  @Input() visibleDate: D;
  @Input() component: Type<DyCalendarCell<D, T>>;
  @Input() min: D;
  @Input() max: D;
  @Input() filter: (D) => boolean;
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;
  @Output() select: EventEmitter<D> = new EventEmitter();

  // TODO static must be false as of Angular 9.0.0, issues/1514
  @ViewChild(TemplateRef, { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {
  }

  ngOnChanges() {
    const factory = this.cfr.resolveComponentFactory(this.component);

    this.containerRef.clear();

    this.row.forEach((date: D) => {
      const component = this.containerRef.createComponent(factory);
      this.patchWithContext(component.instance, date);
      component.changeDetectorRef.detectChanges();
    });
  }

  private patchWithContext(component: DyCalendarCell<D, T>, date: D) {
    component.visibleDate = this.visibleDate;
    component.selectedValue = this.selectedValue;
    component.date = date;
    component.min = this.min;
    component.max = this.max;
    component.filter = this.filter;
    component.size = this.size;
    component.select.subscribe(this.select.emit.bind(this.select));
  }
}
