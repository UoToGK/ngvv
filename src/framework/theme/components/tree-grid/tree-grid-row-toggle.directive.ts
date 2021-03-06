/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Directive, HostListener } from '@angular/core';
import { DyTreeGridCellDirective } from './tree-grid-cell.component';

/**
 * When using custom row toggle, apply this directive on your toggle to toggle row on element click.
 */
@Directive({
  selector: '[dyTreeGridRowToggle]',
})
export class DyTreeGridRowToggleDirective {
  @HostListener('click', ['$event'])
  toggleRow($event) {
    this.cell.toggleRow();
    $event.stopPropagation();
  }

  constructor(private cell: DyTreeGridCellDirective) {}
}
