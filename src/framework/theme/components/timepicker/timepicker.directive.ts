import {
  AfterViewInit,
  Attribute,
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  isDevMode,
  Renderer2,
} from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { fromEvent, merge, Subject } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DyTimePickerComponent } from './timepicker.component';
import { DyOverlayRef, DyScrollStrategy } from '../cdk/overlay/mapping';
import {
  DyAdjustableConnectedPositionStrategy,
  DyAdjustment,
  DyPosition,
  DyPositionBuilderService,
} from '../cdk/overlay/overlay-position';
import { DyOverlayService } from '../cdk/overlay/overlay-service';
import { DyTrigger, DyTriggerStrategy, DyTriggerStrategyBuilderService } from '../cdk/overlay/overlay-trigger';
import { DySelectedTimePayload } from './model';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';
import { DY_DOCUMENT } from '../../theme.options';

/**
 * The `DyTimePickerDirective` is form control that gives you ability to select a time. The timepicker
 * is shown when input receives a `focus` event.
 * ```html
 * <input [dyTimepicker]="timepicker">
 * <dy-timepicker #timepicker></dy-timepicker>
 * ```
 *
 * @stacked-example(Showcase, timepicker/timepicker-showcase.component)
 *
 * ### Installation
 *
 * Import `DyTimepickerModule.forRoot()` to your root module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyTimepickerModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * And `DyTimepickerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyTimepickerModule,
 *   ],
 * })
 * export class PageModule { }
 *
 * ```
 * <div id="native-parse-issue" class="note note-warning">
 * <div class="note-title">Note</div>
 * <div class="note-body">
 * Timepicker uses native Date object by default, which doesn't support parsing by custom format.
 * According to the ECMAScript specification, the only supported format is a format described by ISO 8061 standard.
 * This standard requires date part to be included in the date string,
 * meaning you have to type a date+time in the input.
 * We highly recommend you to use DyDateFnsDateModule or DyMomentDateModule to be able to support time only strings in
 * the timepicker inputs. These modules use date-fns and moment date libraries, which provide capabilities
 * to parse time only strings.
 * See "Formatting Issue" at
 * <a href="https://akveo.github.io/nebular/docs/components/datepicker/overview#formatting-issue">Date picker docs</a>
 * for installation instructions.
 * </div>
 * </div>
 * <hr>
 *
 * ### Usage
 *
 * To show seconds column along with hours and minutes use `withSeconds` input
 *
 * ```html
 * <input [dyTimepicker]="timepicker">
 * <dy-timepicker #timepicker withSeconds></dy-timepicker>
 * ```
 * @stacked-example(Time picker with seconds, timepicker/timepicker-with-seconds.component)
 *
 * To force timepicker work in 12 hours format, use `twelveHoursFormat` input.
 * By default, timepicker choose 12 or 24 formats based on application locale standards
 *
 * ```html
 * <input [dyTimepicker]="timepicker" twelveHoursFormat>
 * <dy-timepicker #timepicker></dy-timepicker>
 * ```
 *
 * @stacked-example(Twelve hours format showcase, timepicker/timepicker-twelve-hours-format.component)
 *
 * A single column picker with options value as time and minute, so users won’t be able to pick
 * hours and minutes individually.
 * You can control options minutes offset via `step` input, e.g.: 11:00, 11:20, 11:40...'
 *
 * @stacked-example(Single column, timepicker/timepicker-single-column.component)
 *
 * Timepicker support forms and reactive forms API so you can provide value using `formControl` and `ngModel` directives
 * @stacked-example(Form control, timepicker/timepicker-form-control.component)
 *
 * <input [dyTimepicker]="timepicker" twelveHoursFormat>
 * <dy-timepicker #timepicke [formControl]="formControl"></dy-timepicker>
 *
 * @stacked-example(NgModel, timepicker/timepicker-ng-model.component)
 *
 * <input [dyTimepicker]="timepicker" twelveHoursFormat>
 * <dy-timepicker #timepicke [ngModel]="date"></dy-timepicker>
 *
 * @styles
 *
 * timepicker-cell-text-color:
 * timepicker-cell-hover-background-color:
 * timepicker-cell-hover-text-color:
 * timepicker-cell-focus-background-color:
 * timepicker-cell-focus-text-color:
 * timepicker-cell-active-background-color:
 * timepicker-cell-active-text-color:
 * timepicker-cell-text-font-size:
 * timepicker-cell-text-font-family:
 * timepicker-cell-text-line-height:
 * timepicker-cell-text-font-weight:
 * timepicker-cell-height:
 * timepicker-header-cell-text-color:
 * timepicker-header-cell-text-font-size:
 * timepicker-header-cell-text-font-family:
 * timepicker-header-cell-height:
 * timepicker-header-cell-text-line-height:
 * timepicker-header-cell-text-font-weight:
 * timepicker-border-color:
 * timepicker-border-style:
 * timepicker-border-width:
 * timepicker-scrollbar-color:
 * timepicker-scrollbar-background-color:
 * timepicker-scrollbar-width:
 * timepicker-single-column-width:
 * timepicker-multiple-column-width:
 * timepicker-title-height:
 * timepicker-title-padding:
 * timepicker-container-width:
 * timepicker-container-height:
 * */
@Directive({
  selector: 'input[dyTimepicker]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DyTimePickerDirective),
    multi: true,
  }],
})
export class DyTimePickerDirective<D> implements AfterViewInit, ControlValueAccessor {
  /**
   * Provides timepicker component.
   * */
  @Input('dyTimepicker')
  get timepicker(): DyTimePickerComponent<D> {
    return this._timePickerComponent;
  }

  set timepicker(timePicker: DyTimePickerComponent<D>) {
    this._timePickerComponent = timePicker;
  }
  protected _timePickerComponent: DyTimePickerComponent<D>;

  /**
   * Time picker overlay offset.
   * */
  @Input() overlayOffset = 8;

  protected lastInputValue: string;
  /**
   * Positioning strategy used by overlay.
   * @docs-private
   * */
  protected positionStrategy: DyAdjustableConnectedPositionStrategy;
  protected overlayRef: DyOverlayRef;
  protected destroy$: Subject<void> = new Subject<void>();
  protected onChange: (value: D) => void = () => {
  };
  protected onTouched = () => {
  };
  /**
   * Trigger strategy used by overlay.
   * @docs-private
   * */
  protected triggerStrategy: DyTriggerStrategy;

  /**
   * Returns html input element.
   * @docs-private
   * */
  get input(): HTMLInputElement {
    return this.hostRef.nativeElement;
  }

  /**
   * Determines is timepicker overlay opened.
   * @docs-private
   * */
  get isOpen(): boolean {
    return this.overlayRef && this.overlayRef.hasAttached();
  }

  /**
   * Determines is timepicker overlay closed.
   * @docs-private
   * */
  get isClosed(): boolean {
    return !this.isOpen;
  }

  constructor(@Inject(DY_DOCUMENT) protected document,
              protected positionBuilder: DyPositionBuilderService,
              protected hostRef: ElementRef,
              protected triggerStrategyBuilder: DyTriggerStrategyBuilderService,
              protected overlay: DyOverlayService,
              protected cd: ChangeDetectorRef,
              protected calendarTimeModelService: DyCalendarTimeModelService<D>,
              protected dateService: DyDateService<D>,
              protected renderer: Renderer2,
              @Attribute('placeholder') protected placeholder: string) {
  }

  /**
   * Returns host input value.
   * @docs-private
   * */
  get inputValue(): string {
    return this.input.value;
  }

  set inputValue(value: string) {
    this.input.value = value;
  }

  ngAfterViewInit() {
    this.subscribeOnInputChange();

    if (!this.placeholder) {
      this.renderer.setProperty(this.input, 'placeholder', this.timepicker.timeFormat);
    }
    this.triggerStrategy = this.createTriggerStrategy();
    this.subscribeOnTriggers();
    this.subscribeToBlur();
  }

  show() {
    if (this.isClosed) {
      this.attachToOverlay();
    }
  }

  hide() {
    if (this.isOpen) {
      this.overlayRef.detach();
      this.cd.markForCheck();
    }
  }

  /**
   * Attaches picker to the timepicker portal.
   * @docs-private
   * */
  protected attachToOverlay() {
    if (!this.overlayRef) {
      this.setupTimepicker();
      this.initOverlay();
    }
    this.overlayRef.attach(this.timepicker.portal);
  }

  setupTimepicker() {
    if (this.dateService.getId() === 'native' && isDevMode()) {
      console.warn('Date.parse noes not support parsing time with custom format.' +
        ' See details here https://akveo.github.io/nebular/docs/components/datepicker/overview#native-parse-issue')
    }
    this.timepicker.setHost(this.hostRef);
    if (this.inputValue) {
      const val = this.dateService.getId() === 'native' ? this.parseNativeDateString(this.inputValue) : this.inputValue;
      this.timepicker.date = this.dateService.parse(val, this.timepicker.timeFormat);
    } else {
      this.timepicker.date = this.calendarTimeModelService.getResetTime();
    }
  }

  protected initOverlay() {
    this.positionStrategy = this.createPositionStrategy();
    this.subscribeOnApplyClick();
    this.createOverlay();
  }

  protected subscribeOnApplyClick() {
    this.timepicker.onSelectTime.pipe(takeUntil(this.destroy$)).subscribe((value: DySelectedTimePayload<D>) => {
      const time = this.dateService.format(value.time, this.timepicker.timeFormat).toUpperCase();
      this.inputValue = time;
      this.timepicker.date = value.time;
      this.onChange(value.time);
      if (value.save) {
        this.lastInputValue = time;
        this.hide();
      }
    });
  }

  protected createOverlay() {
    const scrollStrategy = this.createScrollStrategy();
    this.overlayRef = this.overlay.create(
      {positionStrategy: this.positionStrategy, scrollStrategy});
  }

  protected subscribeOnTriggers() {
    this.triggerStrategy.show$
    .pipe(filter(() => this.isClosed))
    .subscribe(() => this.show());

    this.triggerStrategy.hide$
    .pipe(filter(() => this.isOpen))
    .subscribe(() => {
      this.inputValue = this.lastInputValue || '';
      this.hide();
    });
  }

  protected createTriggerStrategy(): DyTriggerStrategy {
    return this.triggerStrategyBuilder
    .trigger(DyTrigger.FOCUS)
    .host(this.hostRef.nativeElement)
    .container(() => this.getContainer())
    .build();
  }

  protected createPositionStrategy(): DyAdjustableConnectedPositionStrategy {
    return this.positionBuilder
    .connectedTo(this.hostRef)
    .position(DyPosition.BOTTOM)
    .offset(this.overlayOffset)
    .adjustment(DyAdjustment.VERTICAL);
  }

  protected getContainer() {
    return this.overlayRef && this.isOpen && <ComponentRef<any>>{
      location: {
        nativeElement: this.overlayRef.overlayElement,
      },
    };
  }

  protected createScrollStrategy(): DyScrollStrategy {
    return this.overlay.scrollStrategies.block();
  }

  protected subscribeOnInputChange() {
    fromEvent(this.input, 'input')
    .pipe(
      map(() => this.inputValue),
      takeUntil(this.destroy$),
    )
    .subscribe((value: string) => this.handleInputChange(value));
  }

  protected subscribeToBlur() {
    merge(
      this.timepicker.blur,
      fromEvent(this.input, 'blur').pipe(
        filter(() => !this.isOpen && this.document.activeElement !== this.input),
      ),
    ).pipe(takeUntil(this.destroy$))
    .subscribe(() => this.onTouched());
  }

  /**
   * Parses input value and write if it isn't null.
   * @docs-private
   * */
  protected handleInputChange(value: string) {
    if (this.dateService.getId() === 'native') {
      /**
       * Native date service dont parse only time string value,
       * and we adding year mouth and day to convert string to valid date format
       **/
      value = this.parseNativeDateString(value);
    }

    const isValidDate: boolean = this.dateService.isValidDateString(value, this.timepicker.timeFormat);
    if (isValidDate) {
      this.lastInputValue = value;

      const date = this.dateService.parse(value, this.timepicker.timeFormat);
      this.onChange(date);
      this.timepicker.date = date;
    }
  }

  protected updateValue(value: D) {
    if (value) {
      this.timepicker.date = value;
      this.inputValue = this.dateService.format(value, this.timepicker.timeFormat).toUpperCase();
    }
  }

  writeValue(value: D): void {
    this.updateValue(value);
  }

  registerOnChange(fn: (value: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected parseNativeDateString(value: string): string {
    const date = this.dateService.today();
    const year = this.dateService.getYear(date);
    const month = this.calendarTimeModelService.paddToTwoSymbols(this.dateService.getMonth(date));
    const day = this.calendarTimeModelService.paddToTwoSymbols(this.dateService.getDate(date));

    return `${year}-${month}-${day} ${value}`;
  }
}
