import { Directive, Input, OnChanges } from '@angular/core';
import { DyCdkColumnDef } from '../cdk/table/type-mappings';
import { DY_SORT_HEADER_COLUMN_DEF, DyColumnDefDirective } from '../cdk/table/cell';

/**
 * Column definition for the tree-grid.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[dyTreeGridColumnDef]',
  providers: [
    { provide: DyCdkColumnDef, useExisting: DyTreeGridColumnDefDirective },
    { provide: DY_SORT_HEADER_COLUMN_DEF, useExisting: DyTreeGridColumnDefDirective },
  ],
})
export class DyTreeGridColumnDefDirective extends DyColumnDefDirective implements OnChanges {
  /**
   * Column name
   */
  @Input('dyTreeGridColumnDef')
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._setNameInput(value);
  }

  private hideOnValue: number | null = null;
  /**
   * Amount of pixels of viewport at which column should be hidden.
   * type number
   */
  @Input()
  get hideOn(): number | null {
    return this.hideOnValue;
  }
  set hideOn(value: number | null) {
    this.hideOnValue = !value && value !== 0
      ? null
      : parseInt(value as unknown as string, 10);
  }

  private showOnValue: number | null = null;
  /**
   * Amount of pixels of viewport at which column should be shown.
   * type number
   */
  @Input()
  get showOn(): number | null {
    return this.showOnValue;
  }
  set showOn(value: number | null) {
    this.showOnValue = !value && value !== 0
      ? null
      : parseInt(value as unknown as string, 10);
  }

  ngOnChanges() {
    if (this.hideOn != null && this.showOn != null) {
      throw new Error(`hideOn and showOn are mutually exclusive and can't be used simultaneously.`);
    }
  }

  shouldHide(width: number): boolean {
    return !this.shouldShow(width);
  }

  shouldShow(width: number): boolean {
    if (this.hideOn == null && this.showOn == null) {
      return true;
    }

    if (this.hideOn != null) {
      return width > this.hideOn;
    }

    return width >= this.showOn;
  }
}
