/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  Type,
  AfterViewInit,
  OnInit,
  SimpleChanges,
  Optional,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { DyComponentPortal, DyOverlayRef } from '../cdk/overlay/mapping';
import {
  DyAdjustableConnectedPositionStrategy,
  DyAdjustment,
  DyPosition,
  DyPositionBuilderService,
} from '../cdk/overlay/overlay-position';
import { DyOverlayService, patch } from '../cdk/overlay/overlay-service';
import { DyTrigger, DyTriggerStrategy, DyTriggerStrategyBuilderService } from '../cdk/overlay/overlay-trigger';
import { DyDatepickerContainerComponent } from './datepicker-container.component';
import { DY_DOCUMENT } from '../../theme.options';
import { DyCalendarRange, DyCalendarRangeComponent } from '../calendar/calendar-range.component'
import { DyCalendarComponent } from '../calendar/calendar.component';
import {
  DyCalendarCell,
  DyCalendarSize,
  DyCalendarViewMode,
  DyCalendarSizeValues,
  DyCalendarViewModeValues,
} from '../calendar-kit/model';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DY_DATE_SERVICE_OPTIONS, DyDatepicker, DyPickerValidatorConfig } from './datepicker.directive';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';


/**
 * The `DyBasePicker` component concentrates overlay manipulation logic.
 * */
export abstract class DyBasePicker<D, T, P> extends DyDatepicker<T> {
  /**
   * Datepicker date format. Can be used only with date adapters (moment, date-fns) since native date
   * object doesn't support formatting.
   * */
  abstract format: string;

  /**
   * Defines if we should render previous and next months
   * in the current month view.
   * */
  abstract boundingMonth: boolean;

  /**
   * Defines starting view for calendar.
   * */
  abstract startView: DyCalendarViewMode;

  /**
   * Minimum available date for selection.
   * */
  abstract min: T;

  /**
   * Maximum available date for selection.
   * */
  abstract max: T;

  /**
   * Predicate that decides which cells will be disabled.
   * */
  abstract filter: (T) => boolean;

  /**
   * Custom day cell component. Have to implement `DyCalendarCell` interface.
   * */
  abstract dayCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Custom month cell component. Have to implement `DyCalendarCell` interface.
   * */
  abstract monthCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Custom year cell component. Have to implement `DyCalendarCell` interface.
   * */
  abstract yearCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Size of the calendar and entire components.
   * Can be 'medium' which is default or 'large'.
   * */
  abstract size: DyCalendarSize = DyCalendarSize.MEDIUM;

  /**
   * Depending on this date a particular month is selected in the calendar
   */
  abstract visibleDate: D;

  /**
   * Hide picker when a date or a range is selected, `true` by default
   * @type {boolean}
   */
  abstract hideOnSelect: boolean;

  /**
   * Determines should we show calendar navigation or not.
   * @type {boolean}
   */
  abstract showNavigation: boolean;

  /**
   * Sets symbol used as a header for week numbers column
   * */
  abstract weekNumberSymbol: string;

  /**
   * Determines should we show week numbers column.
   * False by default.
   * */
  abstract showWeekNumber: boolean;

  /**
   * Calendar component class that has to be instantiated inside overlay.
   * */
  protected abstract pickerClass: Type<P>;

  /**
   * Overlay reference object.
   * */
  protected ref: DyOverlayRef;

  /**
   * Datepicker container that contains instantiated picker.
   * */
  protected container: ComponentRef<DyDatepickerContainerComponent>;

  /**
   * Positioning strategy used by overlay.
   * */
  protected positionStrategy: DyAdjustableConnectedPositionStrategy;

  /**
   * Trigger strategy used by overlay
   * */
  protected triggerStrategy: DyTriggerStrategy;

  /**
   * HTML input reference to which datepicker connected.
   * */
  protected hostRef: ElementRef;

  protected init$: ReplaySubject<void> = new ReplaySubject<void>();

  /**
   * Stream of picker changes. Required to be the subject because picker hides and shows and picker
   * change stream becomes recreated.
   * */
  protected onChange$: Subject<T> = new Subject();

  /**
   * Reference to the picker instance itself.
   * */
  protected pickerRef: ComponentRef<any>;

  protected overlayOffset = 8;

  protected destroy$ = new Subject<void>();

  /**
   * Queue contains the last value that was applied to the picker when it was hidden.
   * This value will be passed to the picker as soon as it shown.
   * */
  protected queue: T | undefined;

  protected blur$: Subject<void> = new Subject<void>();

  protected constructor(protected overlay: DyOverlayService,
                        protected positionBuilder: DyPositionBuilderService,
                        protected triggerStrategyBuilder: DyTriggerStrategyBuilderService,
                        protected cfr: ComponentFactoryResolver,
                        protected dateService: DyDateService<D>,
                        protected dateServiceOptions,
  ) {
    super();
  }

  /**
   * Returns picker instance.
   * */
  get picker(): any {
    return this.pickerRef && this.pickerRef.instance;
  }

  /**
   * Stream of picker value changes.
   * */
  get valueChange(): Observable<T> {
    return this.onChange$.asObservable();
  }

  get isShown(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  get init(): Observable<void> {
    return this.init$.asObservable();
  }

  /**
   * Emits when datepicker looses focus.
   */
  get blur(): Observable<void> {
    return this.blur$.asObservable();
  }

  protected abstract get pickerValueChange(): Observable<T>;

  /**
   * Datepicker knows nothing about host html input element.
   * So, attach method attaches datepicker to the host input element.
   * */
  attach(hostRef: ElementRef) {
    this.hostRef = hostRef;
    this.subscribeOnTriggers();
  }

  getValidatorConfig(): DyPickerValidatorConfig<T> {
    return { min: this.min, max: this.max, filter: this.filter };
  }

  show() {
    if (!this.ref) {
      this.createOverlay();
    }

    this.openDatepicker();
  }

  shouldHide(): boolean {
    return this.hideOnSelect && !!this.value;
  }

  hide() {
    if (this.ref) {
      this.ref.detach();
    }

    // save current value if picker was rendered
    if (this.picker) {
      this.queue = this.value;
      this.pickerRef.destroy();
      this.pickerRef = null;
      this.container = null;
    }
  }

  protected abstract writeQueue();

  protected createOverlay() {
    this.positionStrategy = this.createPositionStrategy();
    this.ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.subscribeOnPositionChange();
  }

  protected openDatepicker() {
    this.container = this.ref.attach(new DyComponentPortal(DyDatepickerContainerComponent, null, null, this.cfr));
    this.instantiatePicker();
    this.subscribeOnValueChange();
    this.writeQueue();
    this.patchWithInputs();
    this.pickerRef.changeDetectorRef.markForCheck();
  }

  protected createPositionStrategy(): DyAdjustableConnectedPositionStrategy {
    return this.positionBuilder
      .connectedTo(this.hostRef)
      .position(DyPosition.BOTTOM)
      .offset(this.overlayOffset)
      .adjustment(DyAdjustment.COUNTERCLOCKWISE);
  }

  protected subscribeOnPositionChange() {
    this.positionStrategy.positionChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((position: DyPosition) => patch(this.container, { position }));
  }

  protected createTriggerStrategy(): DyTriggerStrategy {
    return this.triggerStrategyBuilder
      .trigger(DyTrigger.FOCUS)
      .host(this.hostRef.nativeElement)
      .container(() => this.container)
      .build();
  }

  protected subscribeOnTriggers() {
    this.triggerStrategy = this.createTriggerStrategy();
    this.triggerStrategy.show$.subscribe(() => this.show());
    this.triggerStrategy.hide$.subscribe(() => {
      this.blur$.next();
      this.hide();
    });
  }

  protected instantiatePicker() {
    this.pickerRef = this.container.instance.attach(new DyComponentPortal(this.pickerClass, null, null, this.cfr));
  }

  /**
   * Subscribes on picker value changes and emit data through this.onChange$ subject.
   * */
  protected subscribeOnValueChange() {
    this.pickerValueChange.subscribe(date => {
      this.onChange$.next(date);
    });
  }

  protected patchWithInputs() {
    this.picker.boundingMonth = this.boundingMonth;
    this.picker.startView = this.startView;
    this.picker.min = this.min;
    this.picker.max = this.max;
    this.picker.filter = this.filter;
    this.picker._cellComponent = this.dayCellComponent;
    this.picker._monthCellComponent = this.monthCellComponent;
    this.picker._yearCellComponent = this.yearCellComponent;
    this.picker.size = this.size;
    this.picker.showNavigation = this.showNavigation;
    this.picker.visibleDate = this.visibleDate;
    this.picker.showWeekNumber = this.showWeekNumber;
    this.picker.weekNumberSymbol = this.weekNumberSymbol;
  }

  protected checkFormat() {
    if (this.dateService.getId() === 'native' && this.format) {
      throw new Error('Can\'t format native date. To use custom formatting you have to install @nebular/moment or ' +
        '@nebular/date-fns package and import DyMomentDateModule or DyDateFnsDateModule accordingly.' +
        'More information at "Formatting issue" ' +
        'https://akveo.github.io/nebular/docs/components/datepicker/overview#dydatepickercomponent');
    }

    const isFormatSet = this.format || (this.dateServiceOptions && this.dateServiceOptions.format);
    if (this.dateService.getId() === 'date-fns' && !isFormatSet) {
      throw new Error('format is required when using DyDateFnsDateModule');
    }
  }
}

@Component({
  template: '',
})
export class DyBasePickerComponent<D, T, P> extends DyBasePicker<D, T, P>
                                            implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  /**
   * Datepicker date format. Can be used only with date adapters (moment, date-fns) since native date
   * object doesn't support formatting.
   * */
  @Input() format: string;

  /**
   * Defines if we should render previous and next months
   * in the current month view.
   * */
  @Input() boundingMonth: boolean = true;

  /**
   * Defines starting view for calendar.
   * */
  @Input() startView: DyCalendarViewMode = DyCalendarViewMode.DATE;
  static ngAcceptInputType_startView: DyCalendarViewModeValues;

  /**
   * Minimum available date for selection.
   * */
  @Input() min: T;

  /**
   * Maximum available date for selection.
   * */
  @Input() max: T;

  /**
   * Predicate that decides which cells will be disabled.
   * */
  @Input() filter: (T) => boolean;

  /**
   * Custom day cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input() dayCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Custom month cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input() monthCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Custom year cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input() yearCellComponent: Type<DyCalendarCell<D, T>>;

  /**
   * Size of the calendar and entire components.
   * Can be 'medium' which is default or 'large'.
   * */
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  /**
   * Depending on this date a particular month is selected in the calendar
   */
  @Input() visibleDate: D;

  /**
   * Hide picker when a date or a range is selected, `true` by default
   * @type {boolean}
   */
  @Input() hideOnSelect: boolean = true;

  /**
   * Determines should we show calendars navigation or not.
   * @type {boolean}
   */
  @Input() showNavigation: boolean = true;

  /**
   * Sets symbol used as a header for week numbers column
   * */
  @Input() weekNumberSymbol: string = '#';

  /**
   * Determines should we show week numbers column.
   * False by default.
   * */
  @Input()
  get showWeekNumber(): boolean {
    return this._showWeekNumber;
  }
  set showWeekNumber(value: boolean) {
    this._showWeekNumber = convertToBoolProperty(value);
  }
  protected _showWeekNumber: boolean = false;
  static ngAcceptInputType_showWeekNumber: DyBooleanInput;

  /**
   * Determines picker overlay offset (in pixels).
   * */
  @Input() overlayOffset = 8;

  constructor(@Inject(DY_DOCUMENT) document,
              positionBuilder: DyPositionBuilderService,
              triggerStrategyBuilder: DyTriggerStrategyBuilderService,
              overlay: DyOverlayService,
              cfr: ComponentFactoryResolver,
              dateService: DyDateService<D>,
              @Optional() @Inject(DY_DATE_SERVICE_OPTIONS) dateServiceOptions,
  ) {
    super(overlay, positionBuilder, triggerStrategyBuilder, cfr, dateService, dateServiceOptions);
  }

  ngOnInit() {
    this.checkFormat();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.format && !changes.format.isFirstChange()) {
      this.checkFormat();
    }
  }

  ngAfterViewInit() {
    this.init$.next();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.hide();
    this.init$.complete();

    if (this.ref) {
      this.ref.dispose();
    }

    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
  }

  protected pickerClass: Type<P>;

  protected get pickerValueChange(): Observable<T> {
    return
  }

  get value(): T {
    return undefined;
  }
  set value(value: T) {}

  protected writeQueue() {
  }
}

/**
 * The DatePicker components itself.
 * Provides a proxy to `DyCalendar` options as well as custom picker options.
 */
@Component({
  selector: 'dy-datepicker',
  template: '',
})
export class DyDatepickerComponent<D> extends DyBasePickerComponent<D, D, DyCalendarComponent<D>> {
  protected pickerClass: Type<DyCalendarComponent<D>> = DyCalendarComponent;

  /**
   * Date which will be rendered as selected.
   * */
  @Input() set date(date: D) {
    this.value = date;
  }

  /**
   * Emits date when selected.
   * */
  @Output() get dateChange(): EventEmitter<D> {
    return this.valueChange as EventEmitter<D>;
  }

  get value(): D {
    return this.picker ? this.picker.date : undefined;
  }

  set value(date: D) {
    if (!this.picker) {
      this.queue = date;
      return;
    }

    if (date) {
      this.visibleDate = date;
      this.picker.visibleDate = date;
      this.picker.date = date;
    }
  }

  protected get pickerValueChange(): Observable<D> {
    return this.picker.dateChange;
  }

  protected writeQueue() {
    if (this.queue) {
      const date = this.queue;
      this.queue = null;
      this.value = date;
    }
  }
}

/**
 * The RangeDatePicker components itself.
 * Provides a proxy to `DyCalendarRange` options as well as custom picker options.
 */
@Component({
  selector: 'dy-rangepicker',
  template: '',
})
export class DyRangepickerComponent<D>
       extends DyBasePickerComponent<D, DyCalendarRange<D>, DyCalendarRangeComponent<D>> {
  protected pickerClass: Type<DyCalendarRangeComponent<D>> = DyCalendarRangeComponent;

  /**
   * Range which will be rendered as selected.
   * */
  @Input() set range(range: DyCalendarRange<D>) {
    this.value = range;
  }

  /**
   * Emits range when start selected and emits again when end selected.
   * */
  @Output() get rangeChange(): EventEmitter<DyCalendarRange<D>> {
    return this.valueChange as EventEmitter<DyCalendarRange<D>>;
  }

  get value(): DyCalendarRange<D> {
    return this.picker ? this.picker.range : undefined;
  }

  set value(range: DyCalendarRange<D>) {
    if (!this.picker) {
      this.queue = range;
      return;
    }

    if (range) {
      const visibleDate = range && range.start;
      this.visibleDate = visibleDate;
      this.picker.visibleDate = visibleDate;
      this.picker.range = range;
    }
  }

  protected get pickerValueChange(): Observable<DyCalendarRange<D>> {
    return this.picker.rangeChange;
  }

  shouldHide(): boolean {
    return super.shouldHide() && !!(this.value && this.value.start && this.value.end);
  }

  protected writeQueue() {
    if (this.queue) {
      const range = this.queue;
      this.queue = null;
      this.value = range;
    }
  }
}
