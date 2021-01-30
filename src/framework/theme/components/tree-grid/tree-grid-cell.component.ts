/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DyLayoutDirectionService } from '../../services/direction.service';
import { DY_WINDOW } from '../../theme.options';
import { DyCellDirective, DyFooterCellDirective, DyHeaderCellDirective } from '../cdk/table/cell';
import { DyCdkCell, DyCdkFooterCell, DyCdkHeaderCell } from '../cdk/table/type-mappings';
import { DY_TREE_GRID } from './tree-grid-injection-tokens';
import { DyTreeGridComponent } from './tree-grid.component';
import { DyTreeGridColumnDefDirective } from './tree-grid-column-def.directive';
import { DY_DEFAULT_ROW_LEVEL } from './data-source/tree-grid.model';
import { DyColumnsService } from './tree-grid-columns.service';

@Directive({
  selector: 'td[dyTreeGridCell]',
  host: {
    'class': 'dy-tree-grid-cell',
    'role': 'gridcell',
  },
  providers: [{ provide: DyCdkCell, useExisting: DyTreeGridCellDirective }],
})
export class DyTreeGridCellDirective extends DyCellDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly tree: DyTreeGridComponent<any>;
  private readonly columnDef: DyTreeGridColumnDefDirective;
  private initialLeftPadding: string = '';
  private initialRightPadding: string = '';
  private latestWidth: string;
  elementRef: ElementRef<HTMLElement>;

  @HostBinding('style.width')
  get columnWidth(): string {
    this.latestWidth = this.tree.getColumnWidth();
    if (this.latestWidth) {
      return this.latestWidth;
    }

    return null;
  }

  @HostBinding('style.padding-left')
  get leftPadding(): string | SafeStyle | null {
    if (this.directionService.isLtr()) {
      return this.getStartPadding();
    }
    return null;
  }

  @HostBinding('style.padding-right')
  get rightPadding(): string | SafeStyle | null {
    if (this.directionService.isRtl()) {
      return this.getStartPadding();
    }
    return null;
  }

  constructor(
    columnDef: DyTreeGridColumnDefDirective,
    elementRef: ElementRef<HTMLElement>,
    @Inject(DY_TREE_GRID) tree,
    @Inject(PLATFORM_ID) private platformId,
    @Inject(DY_WINDOW) private window,
    private sanitizer: DomSanitizer,
    private directionService: DyLayoutDirectionService,
    private columnService: DyColumnsService,
    private cd: ChangeDetectorRef,
  ) {
    super(columnDef, elementRef);
    this.tree = tree as DyTreeGridComponent<any>;
    this.columnDef = columnDef;
    this.elementRef = elementRef;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const style = this.window.getComputedStyle(this.elementRef.nativeElement);
      this.initialLeftPadding = style.paddingLeft;
      this.initialRightPadding = style.paddingRight;
    }

    this.columnService.onColumnsChange()
      .pipe(
        filter(() => this.latestWidth !== this.tree.getColumnWidth()),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleRow(): void {
    this.tree.toggleCellRow(this);
  }

  private get initialStartPadding(): string {
      return this.directionService.isLtr()
      ? this.initialLeftPadding
      : this.initialRightPadding;
  }

  private getStartPadding(): string | SafeStyle | null {
    const rowLevel = this.tree.getCellLevel(this, this.columnDef.name);
    if (rowLevel === DY_DEFAULT_ROW_LEVEL) {
      return null;
    }

    const nestingLevel = rowLevel + 1;
    let padding: string = '';
    if (this.tree.levelPadding) {
      padding = `calc(${this.tree.levelPadding} * ${nestingLevel})`;
    } else if (this.initialStartPadding) {
      padding = `calc(${this.initialStartPadding} * ${nestingLevel})`;
    }

    if (!padding) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustStyle(padding);
  }
}

@Directive({
  selector: 'th[dyTreeGridHeaderCell]',
  host: {
    'class': 'dy-tree-grid-header-cell',
    'role': 'columnheader',
  },
  providers: [{ provide: DyCdkHeaderCell, useExisting: DyTreeGridHeaderCellDirective }],
})
export class DyTreeGridHeaderCellDirective extends DyHeaderCellDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private latestWidth: string;
  private readonly tree: DyTreeGridComponent<any>;

  @HostBinding('style.width')
  get columnWidth(): string {
    this.latestWidth = this.tree.getColumnWidth();
    return this.latestWidth || null;
  }

  constructor(
    columnDef: DyTreeGridColumnDefDirective,
    elementRef: ElementRef<HTMLElement>,
    @Inject(DY_TREE_GRID) tree,
    private columnService: DyColumnsService,
    private cd: ChangeDetectorRef,
  ) {
    super(columnDef, elementRef);
    this.tree = tree as DyTreeGridComponent<any>;
  }

  ngOnInit() {
    this.columnService.onColumnsChange()
      .pipe(
        filter(() => this.latestWidth !== this.tree.getColumnWidth()),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Directive({
  selector: 'td[dyTreeGridFooterCell]',
  host: {
    'class': 'dy-tree-grid-footer-cell',
    'role': 'gridcell',
  },
  providers: [{ provide: DyCdkFooterCell, useExisting: DyTreeGridFooterCellDirective }],
})
export class DyTreeGridFooterCellDirective extends DyFooterCellDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private latestWidth: string;
  private readonly tree: DyTreeGridComponent<any>;

  @HostBinding('style.width')
  get columnWidth(): string {
    this.latestWidth = this.tree.getColumnWidth();
    return this.latestWidth || null;
  }

  constructor(
    columnDef: DyTreeGridColumnDefDirective,
    elementRef: ElementRef,
    @Inject(DY_TREE_GRID) tree,
    private columnService: DyColumnsService,
    private cd: ChangeDetectorRef,
  ) {
    super(columnDef, elementRef);
    this.tree = tree as DyTreeGridComponent<any>;
  }

  ngOnInit() {
    this.columnService.onColumnsChange()
      .pipe(
        filter(() => this.latestWidth !== this.tree.getColumnWidth()),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
