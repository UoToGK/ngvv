import { Component, ElementRef, HostListener, Inject, Input, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DyCdkFooterRow, DyCdkHeaderRow, DyCdkRow } from '../cdk/table/type-mappings';
import { DyFooterRowComponent, DyHeaderRowComponent, DyRowComponent } from '../cdk/table/row';
import { DyTreeGridComponent } from './tree-grid.component';
import { DY_TREE_GRID } from './tree-grid-injection-tokens';

export const DY_ROW_DOUBLE_CLICK_DELAY: number = 200;

/**
 * Cells container. Adds the right class and role.
 */
@Component({
  selector: 'tr[dyTreeGridRow]',
  template: `<ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-tree-grid-row',
    'role': 'row',
  },
  providers: [{ provide: DyCdkRow, useExisting: DyTreeGridRowComponent }],
})
export class DyTreeGridRowComponent extends DyRowComponent implements OnDestroy {
  private readonly doubleClick$ = new Subject();
  private readonly tree: DyTreeGridComponent<any>;

  /**
   * Time to wait for second click to expand row deeply.
   * 200ms by default.
   */
  @Input() doubleClickDelay: number = DY_ROW_DOUBLE_CLICK_DELAY;

  /**
   * Toggle row on click. Enabled by default.
   */
  @Input() clickToToggle: boolean = true;

  @HostListener('click')
  toggleIfEnabledNode(): void {
    if (!this.clickToToggle) {
      return;
    }

    timer(DY_ROW_DOUBLE_CLICK_DELAY)
      .pipe(
        take(1),
        takeUntil(this.doubleClick$),
      )
      .subscribe(() => this.tree.toggleRow(this));
  }

  @HostListener('dblclick')
  toggleIfEnabledNodeDeep() {
    if (!this.clickToToggle) {
      return;
    }

    this.doubleClick$.next();
    this.tree.toggleRow(this, { deep: true });
  }

  constructor(
    @Inject(DY_TREE_GRID) tree,
    public elementRef: ElementRef<HTMLElement>,
  ) {
    super();
    this.tree = tree as DyTreeGridComponent<any>;
  }

  ngOnDestroy() {
    this.doubleClick$.complete();
  }
}

@Component({
  selector: 'tr[dyTreeGridHeaderRow]',
  template: `
    <ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-tree-grid-header-row',
    'role': 'row',
  },
  providers: [{ provide: DyCdkHeaderRow, useExisting: DyTreeGridHeaderRowComponent }],
})
export class DyTreeGridHeaderRowComponent extends DyHeaderRowComponent {}

@Component({
  selector: 'tr[dyTreeGridFooterRow]',
  template: `
    <ng-container dyCellOutlet></ng-container>`,
  host: {
    'class': 'dy-tree-grid-footer-row',
    'role': 'row',
  },
  providers: [{ provide: DyCdkFooterRow, useExisting: DyTreeGridFooterRowComponent }],
})
export class DyTreeGridFooterRowComponent extends DyFooterRowComponent {}
