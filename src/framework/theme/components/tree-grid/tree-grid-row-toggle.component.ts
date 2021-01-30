/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, HostListener, Input } from '@angular/core';
import { DyTreeGridCellDirective } from './tree-grid-cell.component';

/**
 * DyTreeGridRowToggleComponent
 */
@Component({
  selector: 'dy-tree-grid-row-toggle',
  template: `
    <button class="row-toggle-button" [attr.aria-label]="expanded ? 'collapse' : 'expand'">
      <dy-icon [icon]="expanded ? 'chevron-down-outline' : 'chevron-right-outline'"
               pack="nebular-essentials"
               aria-hidden="true">
      </dy-icon>
    </button>
  `,
  styles: [`
    button {
      background: transparent;
      border: none;
      padding: 0;
    }
  `],
})
export class DyTreeGridRowToggleComponent {
  private expandedValue: boolean;
  @Input()
  set expanded(value: boolean) {
    this.expandedValue = value;
  }
  get expanded(): boolean {
    return this.expandedValue;
  }

  @HostListener('click', ['$event'])
  toggleRow($event) {
    this.cell.toggleRow();
    $event.stopPropagation();
  }

  constructor(private cell: DyTreeGridCellDirective) {}
}
