/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  AfterViewInit,
  Attribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  IterableDiffers,
  OnDestroy,
  QueryList,
  EmbeddedViewRef,
  ViewContainerRef,
  Optional,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { DY_DOCUMENT, DY_WINDOW } from '../../theme.options';
import { DyPlatform } from '../cdk/platform/platform-service';
import { DyDirectionality } from '../cdk/bidi/bidi-service';
import {
  DY_TABLE_TEMPLATE,
  DyTable,
  DY_TABLE_PROVIDERS,
  DY_COALESCED_STYLE_SCHEDULER,
  DY_VIEW_REPEATER_STRATEGY,
} from '../cdk/table/table.module';
import { DyRowContext } from '../cdk/table/type-mappings';
import { DyTreeGridDataSource, DyTreeGridDataSourceBuilder } from './data-source/tree-grid-data-source';
import { DY_DEFAULT_ROW_LEVEL, DyTreeGridPresentationNode } from './data-source/tree-grid.model';
import { DyToggleOptions } from './data-source/tree-grid.service';
import { DY_TREE_GRID } from './tree-grid-injection-tokens';
import { DyTreeGridRowComponent } from './tree-grid-row.component';
import { DyTreeGridCellDirective } from './tree-grid-cell.component';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyTreeGridColumnDefDirective } from './tree-grid-column-def.directive';
import {
  DyTreeGridFooterRowDefDirective,
  DyTreeGridHeaderRowDefDirective,
  DyTreeGridRowDefDirective,
} from './tree-grid-def.component';
import { DyColumnsService } from './tree-grid-columns.service';

/**
 * Tree grid component that can be used to display nested rows of data.
 * Supports filtering and sorting.
 * @stacked-example(Showcase, tree-grid/tree-grid-showcase.component)
 *
 * ### Installation
 *
 * Import `DyTreeGridModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyTreeGridModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * As the most basic usage you need to define [dyTreeGridRowDef](docs/components/treegrid/api#dytreegridrowdefdirective)
 * where you should pass columns to display in rows and
 * [dyTreeGridColumnDef](docs/components/treegrid/api#dytreegridcolumndefdirective) - component containing cell
 * definitions for each column passed to row definition.
 * @stacked-example(Basic, tree-grid/tree-grid-basic.component)
 *
 * `DyTreeGridComponent`'s source input and `DyTreeGridDataSourceBuilder.create` expecting data to be an array of
 * objects with `data`, `children` and `expanded` properties. If your data doesn't match this interface, you can pass
 * getter functions for each property as arguments to `DyTreeGridDataSourceBuilder.create` method.
 * @stacked-example(Custom node structure, tree-grid/tree-grid-custom-node-structure.component)
 *
 * To use sorting you can add `dySort` directive to table and subscribe to `sort` method. When user click on header,
 * sort event will be emitted. Event object contain clicked column name and desired sort direction.
 * @stacked-example(Sortable, tree-grid/tree-grid-sortable.component)
 *
 * You can use `Data Source Builder` to create `DyTreeGridDataSource` which would have toggle, sort and
 * filter methods. Then you can call this methods to change sort or toggle rows programmatically. Also `dySort` and
 * `dyFilterInput` directives both support `DyTreeGridDataSource`, so you can pass it directly as an input and
 * directives will trigger sort, toggle themselves.
 * @stacked-example(Data Source Builder, tree-grid/tree-grid-showcase.component)
 *
 * You can create responsive grid by setting `hideOn` and `showOn` inputs of
 * [dyTreeGridColumnDef](docs/components/tree-grid/api#dytreegridcolumndefdirective) directive.
 * When viewport reaches specified width grid hides or shows columns.
 * @stacked-example(Responsive columns, tree-grid/tree-grid-responsive.component)
 *
 * To customize sort or row toggle icons you can use `dySortHeaderIcon` and `dyTreeGridRowToggle` directives
 * respectively. `dySortHeaderIcon` is a structural directive and it's implicit context set to current direction.
 * Also context has three properties: `isAscending`, `isDescending` and `isNone`.
 * @stacked-example(Custom icons, tree-grid/tree-grid-custom-icons.component)
 *
 * By default, row to toggle happens when user clicks anywhere in the row. Also double click expands row deeply.
 * To disable this you can set `[clickToToggle]="false"` input of `dyTreeGridRow`.
 * @stacked-example(Disable click toggle, tree-grid/tree-grid-disable-click-toggle.component)
 *
 * @styles
 *
 * tree-grid-cell-border-width:
 * tree-grid-cell-border-style:
 * tree-grid-cell-border-color:
 * tree-grid-row-min-height:
 * tree-grid-cell-padding:
 * tree-grid-header-background-color:
 * tree-grid-header-text-color:
 * tree-grid-header-text-font-family:
 * tree-grid-header-text-font-size:
 * tree-grid-header-text-font-weight:
 * tree-grid-header-text-line-height:
 * tree-grid-footer-background-color:
 * tree-grid-footer-text-color:
 * tree-grid-footer-text-font-family:
 * tree-grid-footer-text-font-size:
 * tree-grid-footer-text-font-weight:
 * tree-grid-footer-text-line-height:
 * tree-grid-row-background-color:
 * tree-grid-row-even-background-color:
 * tree-grid-row-hover-background-color:
 * tree-grid-row-text-color:
 * tree-grid-row-text-font-family:
 * tree-grid-row-text-font-size:
 * tree-grid-row-text-font-weight:
 * tree-grid-row-text-line-height:
 * tree-grid-sort-header-button-background-color:
 * tree-grid-sort-header-button-border:
 * tree-grid-sort-header-button-padding:
 */
@Component({
  selector: 'table[dyTreeGrid]',
  template: DY_TABLE_TEMPLATE,
  styleUrls: ['./tree-grid.component.scss'],
  providers: [
    { provide: DY_TREE_GRID, useExisting: DyTreeGridComponent },
    DyColumnsService,
    ...DY_TABLE_PROVIDERS,
  ],
})
export class DyTreeGridComponent<T> extends DyTable<DyTreeGridPresentationNode<T>>
                                    implements AfterViewInit, OnDestroy {

  constructor(private dataSourceBuilder: DyTreeGridDataSourceBuilder<T>,
              differs: IterableDiffers,
              changeDetectorRef: ChangeDetectorRef,
              elementRef: ElementRef,
              @Attribute('role') role: string,
              dir: DyDirectionality,
              @Inject(DY_DOCUMENT) document,
              platform: DyPlatform,
              @Inject(DY_WINDOW) private window,
              @Optional() @Inject(DY_VIEW_REPEATER_STRATEGY) protected readonly _viewRepeater?,
              @Optional() @Inject(DY_COALESCED_STYLE_SCHEDULER) protected readonly _coalescedStyleScheduler?,
  ) {
    super(differs, changeDetectorRef, elementRef, role, dir, document, platform, _viewRepeater,
          _coalescedStyleScheduler);
    this.platform = platform;
  }

  private destroy$ = new Subject<void>();
  private _source: DyTreeGridDataSource<T>;
  private platform: DyPlatform;

  /**
   * The table's data
   * @param data
   * @type {<T>[] | DyTreeGridDataSource}
   */
  @Input('dyTreeGrid') set source(data: T[] | DyTreeGridDataSource<T>) {
    if (!data) {
      return;
    }

    if (data instanceof DyTreeGridDataSource) {
      this._source = data;
    } else {
      this._source = this.dataSourceBuilder.create(data);
    }
    this.dataSource = this._source;
  }

  @Input() levelPadding: string = '';

  /**
   * Make all columns equal width. False by default.
   */
  @Input()
  set equalColumnsWidth(value: boolean) {
    this.equalColumnsWidthValue = convertToBoolProperty(value);
  }
  get equalColumnsWidth(): boolean {
    return this.equalColumnsWidthValue;
  }
  private equalColumnsWidthValue: boolean = false;
  static ngAcceptInputType_equalColumnsWidth: DyBooleanInput;

  @HostBinding('class.dy-tree-grid') readonly treeClass = true;

  ngAfterViewInit() {
    this.checkDefsCount();
    const rowsChange$ = merge(
      this._contentRowDefs.changes,
      this._contentHeaderRowDefs.changes,
      this._contentFooterRowDefs.changes,
    );
    rowsChange$.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkDefsCount());

    if (this.platform.isBrowser) {
      this.updateVisibleColumns();

      const windowResize$ = fromEvent(this.window, 'resize').pipe(debounceTime(50));
      merge(rowsChange$, this._contentColumnDefs.changes, windowResize$)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.updateVisibleColumns());
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleRow(row: DyTreeGridRowComponent, options?: DyToggleOptions): void {
    const context = this.getRowContext(row);
    this._source.toggle(context.$implicit.data, options);
  }

  toggleCellRow(cell: DyTreeGridCellDirective): void {
    const context = this.getCellContext(cell);
    this._source.toggle(context.$implicit.data);
  }

  getColumnWidth(): string {
    if (this.equalColumnsWidth) {
      return `${100 / this.getColumnsCount()}%`;
    }
    return '';
  }

  getCellLevel(cell: DyTreeGridCellDirective, columnName: string): number {
    if (this.isFirstColumn(columnName)) {
      return this.getCellContext(cell).$implicit.level;
    }
    return DY_DEFAULT_ROW_LEVEL;
  }

  private getRowContext(row: DyTreeGridRowComponent): DyRowContext<DyTreeGridPresentationNode<T>> {
    return this.getContextByRowEl(row.elementRef.nativeElement);
  }

  private getCellContext(cell: DyTreeGridCellDirective): DyRowContext<DyTreeGridPresentationNode<T>> {
    return this.getContextByCellEl(cell.elementRef.nativeElement);
  }

  private getContextByCellEl(cellEl: HTMLElement): DyRowContext<DyTreeGridPresentationNode<T>> {
    return this.getContextByRowEl(cellEl.parentElement);
  }

  private getContextByRowEl(rowEl: HTMLElement): DyRowContext<DyTreeGridPresentationNode<T>> {
    const rowsContainer: ViewContainerRef = this._rowOutlet.viewContainer;

    for (let i = 0; i < rowsContainer.length; i++) {
      const rowViewRef = rowsContainer.get(i) as EmbeddedViewRef<DyRowContext<DyTreeGridPresentationNode<T>>>;

      if (rowViewRef.rootNodes.includes(rowEl)) {
        return rowViewRef.context;
      }
    }
  }

  private getColumns(): string[] {
    let rowDef: DyTreeGridHeaderRowDefDirective | DyTreeGridRowDefDirective<any>;

    if (this._contentHeaderRowDefs.length) {
      rowDef = this._contentHeaderRowDefs.first as DyTreeGridHeaderRowDefDirective;
    } else {
      rowDef = this._contentRowDefs.first as DyTreeGridRowDefDirective<any>;
    }

    return Array.from(rowDef.getVisibleColumns() || []);
  }

  private getColumnsCount(): number {
    return this.getColumns().length;
  }

  private isFirstColumn(columnName: string): boolean {
    return this.getColumns()[0] === columnName;
  }

  private checkDefsCount(): void {
    if (this._contentRowDefs.length > 1) {
      throw new Error(`Found multiple row definitions`);
    }
    if (this._contentHeaderRowDefs.length > 1) {
      throw new Error(`Found multiple header row definitions`);
    }
    if (this._contentFooterRowDefs.length > 1) {
      throw new Error(`Found multiple footer row definitions`);
    }
  }

  private updateVisibleColumns(): void {
    const width = this.window.innerWidth;
    const columnDefs = (this._contentColumnDefs as QueryList<DyTreeGridColumnDefDirective>);

    const columnsToHide: string[] = columnDefs
      .filter((col: DyTreeGridColumnDefDirective) => col.shouldHide(width))
      .map(col => col.name);

    const columnsToShow: string[] = columnDefs
      .filter((col: DyTreeGridColumnDefDirective) => col.shouldShow(width))
      .map(col => col.name);

    if (!columnsToHide.length && !columnsToShow.length) {
      return;
    }

    const rowDefs = [
      this._contentHeaderRowDefs.first as DyTreeGridHeaderRowDefDirective,
      this._contentRowDefs.first as DyTreeGridRowDefDirective<any>,
      this._contentFooterRowDefs.first as DyTreeGridFooterRowDefDirective,
    ].filter(d => !!d);

    for (const rowDef of rowDefs) {
      for (const column of columnsToHide) {
        rowDef.hideColumn(column);
      }

      for (const column of columnsToShow) {
        rowDef.showColumn(column);
      }
    }
  }
}
