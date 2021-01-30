import { Directive, Input, IterableDiffers, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import {
  DyCdkCellDef,
  DyCdkFooterCellDef,
  DyCdkFooterRowDef,
  DyCdkHeaderCellDef,
  DyCdkHeaderRowDef,
  DyCdkRowDef,
} from '../cdk/table/type-mappings';
import { DyCellDefDirective, DyFooterCellDefDirective, DyHeaderCellDefDirective } from '../cdk/table/cell';
import { DyFooterRowDefDirective, DyHeaderRowDefDirective, DyRowDefDirective } from '../cdk/table/row';
import { DyColumnsService } from './tree-grid-columns.service';

export interface DyTreeGridResponsiveRowDef {
  hideColumn(column: string);
  showColumn(column: string);
}

/**
 * Data row definition for the tree-grid.
 * Captures the header row's template and columns to display.
 */
@Directive({
  selector: '[dyTreeGridRowDef]',
  providers: [{ provide: DyCdkRowDef, useExisting: DyTreeGridRowDefDirective }],
})
export class DyTreeGridRowDefDirective<T> extends DyRowDefDirective<T>
                                          implements OnChanges, DyTreeGridResponsiveRowDef {

  /**
   * Columns to be displayed on this row
   */
  @Input('dyTreeGridRowDefColumns') columns: Iterable<string>;

  constructor(
    template: TemplateRef<any>,
    differs: IterableDiffers,
    private columnsService: DyColumnsService,
  ) {
    super(template, differs);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes['columns']) {
      this.updateColumns(this.columns);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string): void {
    this.columnsService.hideColumn(column);
  }

  /** @docs-private */
  showColumn(column: string): void {
    this.columnsService.showColumn(column);
  }
}

@Directive({
  selector: '[dyTreeGridHeaderRowDef]',
  providers: [{ provide: DyCdkHeaderRowDef, useExisting: DyTreeGridHeaderRowDefDirective }],
})
export class DyTreeGridHeaderRowDefDirective extends DyHeaderRowDefDirective
                                             implements OnChanges, DyTreeGridResponsiveRowDef {
  /**
   * Columns to be displayed on this row
   */
  @Input('dyTreeGridHeaderRowDef') columns: Iterable<string>;

  constructor(
    template: TemplateRef<any>,
    differs: IterableDiffers,
    private columnsService: DyColumnsService,
  ) {
    super(template, differs);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes['columns']) {
      this.updateColumns(this.columns);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string): void {
    this.columnsService.hideColumn(column);
  }

  /** @docs-private */
  showColumn(column: string): void {
    this.columnsService.showColumn(column);
  }
}

@Directive({
  selector: '[dyTreeGridFooterRowDef]',
  providers: [{ provide: DyCdkFooterRowDef, useExisting: DyTreeGridFooterRowDefDirective }],
})
export class DyTreeGridFooterRowDefDirective extends DyFooterRowDefDirective
                                             implements OnChanges, DyTreeGridResponsiveRowDef {
  /**
   * Columns to be displayed on this row
   */
  @Input('dyTreeGridFooterRowDef') columns: Iterable<string>;

  constructor(
    template: TemplateRef<any>,
    differs: IterableDiffers,
    private columnsService: DyColumnsService,
  ) {
    super(template, differs);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes['columns']) {
      this.updateColumns(this.columns);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string): void {
    this.columnsService.hideColumn(column);
  }

  /** @docs-private */
  showColumn(column: string): void {
    this.columnsService.showColumn(column);
  }
}

/**
 * Cell definition for a dy-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[dyTreeGridCellDef]',
  providers: [{ provide: DyCdkCellDef, useExisting: DyTreeGridCellDefDirective }],
})
export class DyTreeGridCellDefDirective extends DyCellDefDirective {}

/**
 * Header cell definition for the dy-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dyTreeGridHeaderCellDef]',
  providers: [{ provide: DyCdkHeaderCellDef, useExisting: DyTreeGridHeaderCellDefDirective }],
})
export class DyTreeGridHeaderCellDefDirective extends DyHeaderCellDefDirective {}

/**
 * Footer cell definition for the dy-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dyTreeGridFooterCellDef]',
  providers: [{ provide: DyCdkFooterCellDef, useExisting: DyTreeGridFooterCellDefDirective }],
})
export class DyTreeGridFooterCellDefDirective extends DyFooterCellDefDirective {}
