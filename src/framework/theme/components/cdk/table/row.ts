import { Component, Directive, Input } from '@angular/core';
import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkCellOutlet,
  DataRowOutlet,
  HeaderRowOutlet,
  FooterRowOutlet,
  NoDataRowOutlet,
} from '@angular/cdk/table';

@Directive({
  selector: '[dyRowOutlet]',
  providers: [{ provide: DataRowOutlet, useExisting: DyDataRowOutletDirective }],
})
export class DyDataRowOutletDirective extends DataRowOutlet {}

@Directive({
  selector: '[dyHeaderRowOutlet]',
  providers: [{ provide: HeaderRowOutlet, useExisting: DyHeaderRowOutletDirective }],
})
export class DyHeaderRowOutletDirective extends HeaderRowOutlet {}

@Directive({
  selector: '[dyFooterRowOutlet]',
  providers: [{ provide: FooterRowOutlet, useExisting: DyFooterRowOutletDirective }],
})
export class DyFooterRowOutletDirective extends FooterRowOutlet {}

@Directive({
  selector: '[dyNoDataRowOutlet]',
  providers: [{ provide: NoDataRowOutlet, useExisting: DyNoDataRowOutletDirective }],
})
export class DyNoDataRowOutletDirective extends NoDataRowOutlet {}

@Directive({
  selector: '[dyCellOutlet]',
  providers: [{ provide: CdkCellOutlet, useExisting: DyCellOutletDirective }],
})
export class DyCellOutletDirective extends CdkCellOutlet {}

/**
 * Header row definition for the dy-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[dyHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: DyHeaderRowDefDirective }],
})
export class DyHeaderRowDefDirective extends CdkHeaderRowDef {
  @Input('dyHeaderRowDef') columns: Iterable<string>;
  @Input('dyHeaderRowDefSticky') sticky: boolean;
}

/**
 * Footer row definition for the dy-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[dyFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: DyFooterRowDefDirective }],
})
export class DyFooterRowDefDirective extends CdkFooterRowDef {
  @Input('dyFooterRowDef') columns: Iterable<string>;
  @Input('dyFooterRowDefSticky') sticky: boolean;
}

/**
 * Data row definition for the dy-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[dyRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: DyRowDefDirective }],
})
export class DyRowDefDirective<T> extends CdkRowDef<T> {
  @Input('dyRowDefColumns') columns: Iterable<string>;
  @Input('dyRowDefWhen') when: (index: number, rowData: T) => boolean;
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'dy-header-row, tr[dyHeaderRow]',
  template: `
    <ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-header-row',
    'role': 'row',
  },
  providers: [{ provide: CdkHeaderRow, useExisting: DyHeaderRowComponent }],
})
export class DyHeaderRowComponent extends CdkHeaderRow {
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'dy-footer-row, tr[dyFooterRow]',
  template: `
    <ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-footer-row',
    'role': 'row',
  },
  providers: [{ provide: CdkFooterRow, useExisting: DyFooterRowComponent }],
})
export class DyFooterRowComponent extends CdkFooterRow {
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'dy-row, tr[dyRow]',
  template: `
    <ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-row',
    'role': 'row',
  },
  providers: [{ provide: CdkRow, useExisting: DyRowComponent }],
})
export class DyRowComponent extends CdkRow {
}
