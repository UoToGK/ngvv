/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyTableModule } from '../cdk/table/table.module';
import { DyIconModule } from '../icon/icon.module';
import { DyTreeGridComponent } from './tree-grid.component';
import {
  DyTreeGridCellDefDirective,
  DyTreeGridFooterCellDefDirective,
  DyTreeGridFooterRowDefDirective,
  DyTreeGridHeaderCellDefDirective,
  DyTreeGridHeaderRowDefDirective,
  DyTreeGridRowDefDirective,
} from './tree-grid-def.component';
import {
  DyTreeGridFooterRowComponent,
  DyTreeGridHeaderRowComponent,
  DyTreeGridRowComponent,
} from './tree-grid-row.component';
import {
  DyTreeGridCellDirective,
  DyTreeGridFooterCellDirective,
  DyTreeGridHeaderCellDirective,
} from './tree-grid-cell.component';
import {
  DySortDirective,
  DySortHeaderComponent,
  DySortHeaderIconDirective,
  DySortIconComponent,
} from './tree-grid-sort.component';
import { DyTreeGridDataSourceBuilder } from './data-source/tree-grid-data-source';
import { DyTreeGridSortService } from './data-source/tree-grid-sort.service';
import { DyTreeGridFilterService } from './data-source/tree-grid-filter.service';
import { DyTreeGridService } from './data-source/tree-grid.service';
import { DyTreeGridDataService } from './data-source/tree-grid-data.service';
import { DyFilterDirective, DyFilterInputDirective } from './tree-grid-filter';
import { DyTreeGridRowToggleDirective } from './tree-grid-row-toggle.directive';
import { DyTreeGridColumnDefDirective } from './tree-grid-column-def.directive';
import { DyTreeGridRowToggleComponent } from './tree-grid-row-toggle.component';

const COMPONENTS = [
  // Tree Grid
  DyTreeGridComponent,

  DyTreeGridRowDefDirective,
  DyTreeGridRowComponent,
  DyTreeGridCellDefDirective,
  DyTreeGridCellDirective,

  DyTreeGridHeaderRowDefDirective,
  DyTreeGridHeaderRowComponent,
  DyTreeGridHeaderCellDefDirective,
  DyTreeGridHeaderCellDirective,

  DyTreeGridFooterRowDefDirective,
  DyTreeGridFooterRowComponent,
  DyTreeGridFooterCellDefDirective,
  DyTreeGridFooterCellDirective,

  DyTreeGridColumnDefDirective,

  // Sort directives
  DySortDirective,
  DySortHeaderComponent,
  DySortIconComponent,

  // Filter directives
  DyFilterDirective,
  DyFilterInputDirective,

  DyTreeGridRowToggleDirective,
  DyTreeGridRowToggleComponent,
  DySortHeaderIconDirective,
];

@NgModule({
  imports: [ CommonModule, DyTableModule, DyIconModule ],
  declarations: [ ...COMPONENTS ],
  exports: [ DyTableModule, ...COMPONENTS ],
  providers: [
    DyTreeGridSortService,
    DyTreeGridFilterService,
    DyTreeGridService,
    DyTreeGridDataService,
    DyTreeGridDataSourceBuilder,
  ],
})
export class DyTreeGridModule {}
