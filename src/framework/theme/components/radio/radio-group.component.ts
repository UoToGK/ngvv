/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  PLATFORM_ID,
  Inject,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from, fromEvent, merge, Subject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DY_DOCUMENT } from '../../theme.options';
import { DyComponentOrCustomStatus } from '../component-status';
import { DyRadioComponent } from './radio.component';

/**
 * The `DyRadioGroupComponent` is the wrapper for `dy-radio` button.
 * It provides form bindings:
 *
 * ```html
 * <dy-radio-group [(ngModel)]="selectedOption">
 *   <dy-radio value="1">Option 1</dy-radio>
 *   <dy-radio value="2">Option 2</dy-radio>
 *   <dy-radio value="3">Option 3</dy-radio>
 * </dy-radio-group>
 * ```
 *
 * Also, you can use `value` and `valueChange` for binding without forms.
 *
 * ```html
 * <dy-radio-group [(value)]="selectedOption">
 *   <dy-radio value="1">Option 1</dy-radio>
 *   <dy-radio value="2">Option 2</dy-radio>
 *   <dy-radio value="3">Option 3</dy-radio>
 * </dy-radio-group>
 * ```
 *
 * Radio items name has to be provided through `name` input property of the radio group.
 *
 * ```html
 * <dy-radio-group name="my-radio-group">
 *   ...
 * </dy-radio-group>
 * ```
 *
 * You can change radio group status by setting `status` input.
 * @stacked-example(Statuses, radio/radio-statuses.component)
 *
 * Also, you can disable the whole group using `disabled` attribute.
 * @stacked-example(Disabled group, radio/radio-disabled-group.component)
 *
 * */
@Component({
  selector: 'dy-radio-group',
  template: `
    <ng-content select="dy-radio"></ng-content>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DyRadioGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyRadioGroupComponent implements AfterContentInit, OnDestroy, ControlValueAccessor {

  protected destroy$ = new Subject<void>();
  protected onChange = (value: any) => {};
  protected onTouched = () => {};

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
    this.updateValues();
  }
  protected _value: any;

  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    this.updateNames();
  }
  protected _name: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = convertToBoolProperty(disabled);
    this.updateDisabled();
  }
  protected _disabled: boolean;
  static ngAcceptInputType_disabled: DyBooleanInput;

  /**
   * Radio buttons status.
   * Possible values are `primary` (default), `success`, `warning`, `danger`, `info`.
   */
  @Input()
  get status(): DyComponentOrCustomStatus {
    return this._status;
  }
  set status(value: DyComponentOrCustomStatus) {
    if (this._status !== value) {
      this._status = value;
      this.updateStatus();
    }
  }
  protected _status: DyComponentOrCustomStatus = 'basic';

  @ContentChildren(DyRadioComponent, { descendants: true }) radios: QueryList<DyRadioComponent>;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor(
    protected hostElement: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) protected platformId,
    @Inject(DY_DOCUMENT) protected document,
  ) {}

  ngAfterContentInit() {
    // In case option 'name' isn't set on dy-radio component,
    // we need to set it's name right away, so it won't overlap with options
    // without names from other radio groups. Otherwise they all would have
    // same name and will be considered as options from one group so only the
    // last option will stay selected.
    this.updateNames();

    this.radios.changes
      .pipe(
        startWith(this.radios),
        // 'changes' emit during change detection run and we can't update
        // option properties right of since they already was initialized.
        // Instead we schedule microtask to update radios after change detection
        // run is finished and trigger one more change detection run.
        switchMap((radios: QueryList<DyRadioComponent>) => from(Promise.resolve(radios))),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateAndSubscribeToRadios());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  protected updateAndSubscribeToRadios() {
    this.updateValueFromCheckedOption();
    this.updateNames();
    this.updateValues();
    this.updateDisabled();
    this.updateStatus();
    this.subscribeOnRadiosValueChange();
    this.subscribeOnRadiosBlur();
  }

  protected updateNames() {
    if (this.radios) {
      this.radios.forEach((radio: DyRadioComponent) => radio._setName(this.name));
    }
  }

  protected updateValues() {
    this.updateAndMarkForCheckRadios((radio: DyRadioComponent) => radio.checked = radio.value === this.value);
  }

  protected updateDisabled() {
    if (typeof this.disabled !== 'undefined') {
      this.updateAndMarkForCheckRadios((radio: DyRadioComponent) => radio.disabled = this.disabled);
    }
  }

  protected subscribeOnRadiosValueChange() {
    if (!this.radios || !this.radios.length) {
      return;
    }

    merge(...this.radios.map((radio: DyRadioComponent) => radio.valueChange))
      .pipe(
        takeUntil(
          merge(
            this.radios.changes,
            this.destroy$,
          ),
        ),
      )
      .subscribe((value: any) => {
        this.writeValue(value);
        this.propagateValue(value);
      });
  }

  protected propagateValue(value: any) {
    this.valueChange.emit(value);
    this.onChange(value);
  }

  protected subscribeOnRadiosBlur() {
    const hasNoRadios = !this.radios || !this.radios.length;
    if (!isPlatformBrowser(this.platformId) || hasNoRadios) {
      return;
    }

    const hostElement = this.hostElement.nativeElement;
    fromEvent<Event>(hostElement, 'focusin')
      .pipe(
        filter(event => hostElement.contains(event.target as Node)),
        switchMap(() => merge(
          fromEvent<Event>(this.document, 'focusin'),
          fromEvent<Event>(this.document, 'click'),
        )),
        filter(event => !hostElement.contains(event.target as Node)),
        takeUntil(
          merge(
            this.radios.changes,
            this.destroy$,
          ),
        ),
      )
      .subscribe(() => this.onTouched());
  }

  protected updateStatus() {
    this.updateAndMarkForCheckRadios((radio: DyRadioComponent) => radio.status = this.status);
  }

  protected updateAndMarkForCheckRadios(updateFn: (DyRadioComponent) => void) {
    if (this.radios) {
      this.radios.forEach((radio) => {
        updateFn(radio);
        radio._markForCheck();
      });
    }
  }

  protected updateValueFromCheckedOption() {
    const checkedRadio = this.radios.find((radio) => radio.checked);
    const isValueMissing = this.value === undefined || this.value === null;
    if (checkedRadio && isValueMissing && checkedRadio.value !== this.value) {
      this.value = checkedRadio.value;
    }
  }
}
