/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license infordyion.
 */

import { Directive, ElementRef, InjectionToken, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Cell definition for the dy-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[dyCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: DyCellDefDirective }],
})
export class DyCellDefDirective extends CdkCellDef {
}

/**
 * Header cell definition for the dy-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dyHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: DyHeaderCellDefDirective }],
})
export class DyHeaderCellDefDirective extends CdkHeaderCellDef {
}

/**
 * Footer cell definition for the dy-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dyFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: DyFooterCellDefDirective }],
})
export class DyFooterCellDefDirective extends CdkFooterCellDef {
}

export const DY_SORT_HEADER_COLUMN_DEF = new InjectionToken('DY_SORT_HEADER_COLUMN_DEF');

/**
 * Column definition for the dy-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[dyColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: DyColumnDefDirective },
    { provide: DY_SORT_HEADER_COLUMN_DEF, useExisting: DyColumnDefDirective },
  ],
})
export class DyColumnDefDirective extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('dyColumnDef')
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._setNameInput(value);
  }

  /** Whether this column should be sticky positioned at the start of the row */
  @Input() sticky: boolean;

  /** Whether this column should be sticky positioned on the end of the row */
  @Input()
  get stickyEnd(): boolean {
    return this._stickyEnd;
  }
  set stickyEnd(value: boolean) {
    const prevValue = this._stickyEnd;
    this._stickyEnd = coerceBooleanProperty(value);
    this._hasStickyChanged = prevValue !== this._stickyEnd;
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'dy-header-cell, th[dyHeaderCell]',
  host: {
    'class': 'dy-header-cell',
    'role': 'columnheader',
  },
})
export class DyHeaderCellDirective extends CdkHeaderCell {
  constructor(columnDef: DyColumnDefDirective,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`dy-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'dy-footer-cell, td[dyFooterCell]',
  host: {
    'class': 'dy-footer-cell',
    'role': 'gridcell',
  },
})
export class DyFooterCellDirective extends CdkFooterCell {
  constructor(columnDef: DyColumnDefDirective,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`dy-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'dy-cell, td[dyCell]',
  host: {
    'class': 'dy-cell',
    'role': 'gridcell',
  },
})
export class DyCellDirective extends CdkCell {
  constructor(columnDef: DyColumnDefDirective,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`dy-column-${columnDef.cssClassFriendlyName}`);
  }
}
