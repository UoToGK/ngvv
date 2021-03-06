/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  Type,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { fromEvent, Observable, merge, Subject } from 'rxjs';
import { map, takeUntil, filter, take, tap } from 'rxjs/operators';

import { DY_DOCUMENT } from '../../theme.options';
import { DyDateService } from '../calendar-kit/services/date.service';


/**
 * The `DyDatepickerAdapter` instances provide way how to parse, format and validate
 * different date types.
 * */
export abstract class DyDatepickerAdapter<D> {
  /**
   * Picker component class.
   * */
  abstract picker: Type<any>;

  /**
   * Parse date string according to the format.
   * */
  abstract parse(value: string, format: string): D;

  /**
   * Format date according to the format.
   * */
  abstract format(value: D, format: string): string;

  /**
   * Validates date string according to the passed format.
   * */
  abstract isValid(value: string, format: string): boolean;
}

/**
 * Validators config that will be used by form control to perform proper validation.
 * */
export interface DyPickerValidatorConfig<D> {
  /**
   * Minimum date available in picker.
   * */
  min: D;

  /**
   * Maximum date available in picker.
   * */
  max: D;

  /**
   * Predicate that determines is value available for picking.
   * */
  filter: (D) => boolean;
}

/**
 * Datepicker is an control that can pick any values anyway.
 * It has to be bound to the datepicker directive through dyDatepicker input.
 * */
export abstract class DyDatepicker<T> {
  /**
   * HTML input element date format.
   * */
  abstract format: string;

  abstract get value(): T;

  abstract set value(value: T);

  abstract get valueChange(): Observable<T>;

  abstract get init(): Observable<void>;

  /**
   * Attaches datepicker to the native input element.
   * */
  abstract attach(hostRef: ElementRef);

  /**
   * Returns validator configuration based on the input properties.
   * */
  abstract getValidatorConfig(): DyPickerValidatorConfig<T>;

  abstract show();

  abstract hide();

  abstract shouldHide(): boolean;

  abstract get isShown(): boolean;

  abstract get blur(): Observable<void>;
}

export const DY_DATE_ADAPTER = new InjectionToken<DyDatepickerAdapter<any>>('Datepicker Adapter');

export const DY_DATE_SERVICE_OPTIONS = new InjectionToken('Date service options');

/**
 * The `DyDatepickerDirective` is form control that gives you ability to select dates and ranges. The datepicker
 * is shown when input receives a `focus` event.
 *
 * ```html
 * <input [dyDatepicker]="datepicker">
 * <dy-datepicker #datepicker></dy-datepicker>
 * ```
 *
 * @stacked-example(Showcase, datepicker/datepicker-showcase.component)
 *
 * ### Installation
 *
 * Import `DyDatepickerModule.forRoot()` to your root module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyDatepickerModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * And `DyDatepickerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyDatepickerModule,
 *   ],
 * })
 *
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * If you want to use range selection, you have to use `DyRangepickerComponent` instead:
 *
 * ```html
 * <input [dyDatepicker]="rangepicker">
 * <dy-rangepicker #rangepicker></dy-rangepicker>
 * ```
 *
 * Both range and date pickers support all parameters as calendar, so, check `DyCalendarComponent` for additional
 * info.
 *
 * @stacked-example(Range showcase, datepicker/rangepicker-showcase.component)
 *
 * Datepicker is the form control so it can be bound with angular forms through ngModel and form controls.
 *
 * @stacked-example(Forms, datepicker/datepicker-forms.component)
 *
 * `DyDatepickerDirective` may be validated using `min` and `max` dates passed to the datepicker.
 * And `filter` predicate that receives date object and has to return a boolean value.
 *
 * @stacked-example(Validation, datepicker/datepicker-validation.component)
 *
 * If you need to pick a time along with the date, you can use dy-date-timepicker
 *
 * ```html
 * <input dyInput placeholder="Pick Date" [dyDatepicker]="dateTimePicker">
 * <dy-date-timepicker withSeconds #dateTimePicker></dy-date-timepicker>
 * ```
 * @stacked-example(Date timepicker, datepicker/date-timepicker-showcase.component)
 *
 * A single column picker with options value as time and minute, so users won???t be able to pick
 * hours and minutes individually.
 *
 * @stacked-example(Date timepicker single column, datepicker/date-timepicker-single-column.component)

 * The `DyDatepickerComponent` supports date formatting:
 *
 * ```html
 * <input [dyDatepicker]="datepicker">
 * <dy-datepicker #datepicker format="MM\dd\yyyy"></dy-datepicker>
 * ```
 * <span id="formatting-issue"></span>
 * ## Formatting Issue
 *
 * By default, datepicker uses angulars `LOCALE_ID` token for localization and `DatePipe` for dates formatting.
 * And native `Date.parse(...)` for dates parsing. But native `Date.parse` function doesn't support formats.
 * To provide custom formatting you have to use one of the following packages:
 *
 * - `@nebular/moment` - provides moment date adapter that uses moment for date objects. This means datepicker than
 * will operate only moment date objects. If you want to use it you have to install it: `npm i @nebular/moment`, and
 * import `DyMomentDateModule` from this package.
 *
 * - `@nebular/date-fns` - adapter for popular date-fns library. This way is preferred if you need only date formatting.
 * Because date-fns is treeshakable, tiny and operates native date objects. If you want to use it you have to
 * install it: `npm i @nebular/date-fns`, and import `DyDateFnsDateModule` from this package.
 *
 * ### DyDateFnsDateModule
 *
 * Format is required when using `DyDateFnsDateModule`. You can set it via `format` input on datepicker component:
 * ```html
 * <dy-datepicker format="dd.MM.yyyy"></dy-datepicker>
 * ```
 * Also format can be set globally with `DyDateFnsDateModule.forRoot({ format: 'dd.MM.yyyy' })` and
 * `DyDateFnsDateModule.forChild({ format: 'dd.MM.yyyy' })` methods.
 *
 * Please note to use some of the formatting tokens you also need to pass
 * `{ useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true }` to date-fns parse and format functions.
 * You can configure options passed this functions by setting `formatOptions` and
 * `parseOptions` of options object passed to `DyDateFnsDateModule.forRoot` and `DyDateFnsDateModule.forChild` methods.
 * ```ts
 * DyDateFnsDateModule.forRoot({
 *   parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
 *   formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
 * })
 * ```
 * Further info on `date-fns` formatting tokens could be found at
 * [date-fns docs](https://date-fns.org/v2.0.0-alpha.27/docs/Unicode-Tokens).
 *
 * You can also use `parseOptions` and `formatOptions` to provide locale.
 * ```ts
 * import { eo } from 'date-fns/locale';
 *
 * @NgModule({
 *   imports: [
 *     DyDateFnsDateModule.forRoot({
 *       parseOptions: { locale: eo },
 *       formatOptions: { locale: eo },
 *     }),
 *   ],
 * })
 * ```
 *
 * @styles
 *
 * datepicker-background-color:
 * datepicker-border-color:
 * datepicker-border-style:
 * datepicker-border-width:
 * datepicker-border-radius:
 * datepicker-shadow:
 * */
@Directive({
  selector: 'input[dyDatepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DyDatepickerDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DyDatepickerDirective),
      multi: true,
    },
  ],
})
export class DyDatepickerDirective<D> implements OnDestroy, ControlValueAccessor, Validator {
  /**
   * Provides datepicker component.
   * */
  @Input('dyDatepicker')
  set setPicker(picker: DyDatepicker<D>) {
    this.picker = picker;
    this.setupPicker();
  }

  /**
   * Datepicker adapter.
   * */
  protected datepickerAdapter: DyDatepickerAdapter<D>;

  /**
   * Datepicker instance.
   * */
  protected picker: DyDatepicker<D>;
  protected destroy$ = new Subject<void>();
  protected isDatepickerReady: boolean = false;
  protected queue: D | undefined;
  protected onChange: (D) => void = () => {};
  protected onTouched: () => void = () => {};

  /**
   * Form control validators will be called in validators context, so, we need to bind them.
   * */
  protected validator: ValidatorFn = Validators.compose([
    this.parseValidator,
    this.minValidator,
    this.maxValidator,
    this.filterValidator,
  ].map(fn => fn.bind(this)));

  constructor(@Inject(DY_DOCUMENT) protected document,
              @Inject(DY_DATE_ADAPTER) protected datepickerAdapters: DyDatepickerAdapter<D>[],
              protected hostRef: ElementRef,
              protected dateService: DyDateService<D>,
              protected changeDetector: ChangeDetectorRef) {
    this.subscribeOnInputChange();
  }

  /**
   * Returns html input element.
   * */
  get input(): HTMLInputElement {
    return this.hostRef.nativeElement;
  }

  /**
   * Returns host input value.
   * */
  get inputValue(): string {
    return this.input.value;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Writes value in picker and html input element.
   * */
  writeValue(value: D) {
    if (this.isDatepickerReady) {
      this.writePicker(value);
      this.writeInput(value);
    } else {
      this.queue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
  }

  /**
   * Form control validation based on picker validator config.
   * */
  validate(): ValidationErrors | null {
    return this.validator(null);
  }

  /**
   * Hides picker, focuses the input
   */
  protected hidePicker() {
    this.input.focus();
    this.picker.hide();
  }

  /**
   * Validates that we can parse value correctly.
   * */
  protected parseValidator(): ValidationErrors | null {
    /**
     * Date services treat empty string as invalid date.
     * That's why we're getting invalid formControl in case of empty input which is not required.
     * */
    if (this.inputValue === '') {
      return null;
    }

    const isValid = this.datepickerAdapter.isValid(this.inputValue, this.picker.format);
    return isValid ? null : { dyDatepickerParse: { value: this.inputValue } };
  }

  /**
   * Validates passed value is greater than min.
   * */
  protected minValidator(): ValidationErrors | null {
    const config = this.picker.getValidatorConfig();
    const date = this.datepickerAdapter.parse(this.inputValue, this.picker.format);
    return (!config.min || !date || this.dateService.compareDates(config.min, date) <= 0) ?
      null : { dyDatepickerMin: { min: config.min, actual: date } };
  }

  /**
   * Validates passed value is smaller than max.
   * */
  protected maxValidator(): ValidationErrors | null {
    const config = this.picker.getValidatorConfig();
    const date = this.datepickerAdapter.parse(this.inputValue, this.picker.format);
    return (!config.max || !date || this.dateService.compareDates(config.max, date) >= 0) ?
      null : { dyDatepickerMax: { max: config.max, actual: date } };
  }

  /**
   * Validates passed value satisfy the filter.
   * */
  protected filterValidator(): ValidationErrors | null {
    const config = this.picker.getValidatorConfig();
    const date = this.datepickerAdapter.parse(this.inputValue, this.picker.format);
    return (!config.filter || !date || config.filter(date)) ?
      null : { dyDatepickerFilter: true };
  }

  /**
   * Chooses datepicker adapter based on passed picker component.
   * */
  protected chooseDatepickerAdapter() {
    this.datepickerAdapter = this.datepickerAdapters.find(({ picker }) => this.picker instanceof picker);

    if (this.noDatepickerAdapterProvided()) {
      throw new Error('No datepickerAdapter provided for picker');
    }
  }

  /**
   * Attaches picker to the host input element and subscribes on value changes.
   * */
  protected setupPicker() {
    this.chooseDatepickerAdapter();
    this.picker.attach(this.hostRef);

    if (this.inputValue) {
      this.picker.value = this.datepickerAdapter.parse(this.inputValue, this.picker.format);
    }

    // In case datepicker component placed after the input with datepicker directive,
    // we can't read `this.picker.format` on first change detection run,
    // since it's not bound yet, so we have to wait for datepicker component initialization.
    if (!this.isDatepickerReady) {
      this.picker.init
        .pipe(
          take(1),
          tap(() => this.isDatepickerReady = true),
          filter(() => !!this.queue),
          takeUntil(this.destroy$),
        )
        .subscribe(() => {
          this.writeValue(this.queue);
          this.onChange(this.queue);
          this.changeDetector.detectChanges();
          this.queue = undefined;
        });
    }

    this.picker.valueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: D) => {
        this.writePicker(value);
        this.writeInput(value);
        this.onChange(value);

        if (this.picker.shouldHide()) {
          this.hidePicker();
        }
      });

    merge(
      this.picker.blur,
      fromEvent(this.input, 'blur').pipe(
        filter(() => !this.picker.isShown && this.document.activeElement !== this.input),
      ),
    ).pipe(takeUntil(this.destroy$))
     .subscribe(() => this.onTouched());
  }

  protected writePicker(value: D) {
    this.picker.value = value;
  }

  protected writeInput(value: D) {
    const stringRepresentation = this.datepickerAdapter.format(value, this.picker.format);
    this.hostRef.nativeElement.value = stringRepresentation;
  }

  /**
   * Validates if no datepicker adapter provided.
   * */
  protected noDatepickerAdapterProvided(): boolean {
    return !this.datepickerAdapter || !(this.datepickerAdapter instanceof DyDatepickerAdapter);
  }

  protected subscribeOnInputChange() {
    fromEvent(this.input, 'input')
      .pipe(
        map(() => this.inputValue),
        takeUntil(this.destroy$),
      )
      .subscribe((value: string) => this.handleInputChange(value));
  }

  /**
   * Parses input value and write if it isn't null.
   * */
  protected handleInputChange(value: string) {
    const date = this.parseInputValue(value);

    this.onChange(date);
    this.writePicker(date);
  }

  protected parseInputValue(value): D | null {
    if (this.datepickerAdapter.isValid(value, this.picker.format)) {
      return this.datepickerAdapter.parse(value, this.picker.format);
    }

    return null;
  }
}
