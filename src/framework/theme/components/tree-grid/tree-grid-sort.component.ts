/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { convertToBoolProperty, DyBooleanInput, DyNullableInput } from '../helpers';
import { DY_SORT_HEADER_COLUMN_DEF } from '../cdk/table/cell';

/** Column definition associated with a `DySortHeaderDirective`. */
interface DySortHeaderColumnDef {
  name: string;
}

export interface DySortRequest {
  column: string;
  direction: DySortDirection;
}

export interface DySortable {
  sort(sortRequest: DySortRequest);
}

export type DySortDirectionValues = 'asc' | 'desc' | '';
export enum DySortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  NONE = '',
}
const sortDirections: DySortDirection[] = [
  DySortDirection.ASCENDING,
  DySortDirection.DESCENDING,
  DySortDirection.NONE,
];

/**
 * Directive triggers sort method of passed object when sort header changes direction
 */
@Directive({ selector: '[dySort]' })
export class DySortDirective {
  @Input('dySort') sortable: DySortable;
  static ngAcceptInputType_sortable: DySortable | DyNullableInput;

  @Output() sort: EventEmitter<DySortRequest> = new EventEmitter<DySortRequest>();

  emitSort(sortRequest: DySortRequest) {
    if (this.sortable && this.sortable.sort) {
      this.sortable.sort(sortRequest);
    }
    this.sort.emit(sortRequest);
  }
}

export interface DySortHeaderIconDirectiveContext {
  $implicit: DySortDirection;
  isAscending: boolean;
  isDescending: boolean;
  isNone: boolean;
}

/**
 * Directive for headers sort icons. Mark you icon implementation with this structural directive and
 * it'll set template's implicit context with current direction. Context also has `isAscending`,
 * `isDescending` and `isNone` properties.
 */
@Directive({ selector: '[dySortHeaderIcon]' })
export class DySortHeaderIconDirective {}

@Component({
  selector: 'dy-sort-icon',
  template: `
    <ng-container *ngIf="isDirectionSet()">
      <dy-icon *ngIf="isAscending()" icon="chevron-down-outline" pack="nebular-essentials" aria-hidden="true"></dy-icon>
      <dy-icon *ngIf="isDescending()" icon="chevron-up-outline" pack="nebular-essentials" aria-hidden="true"></dy-icon>
    </ng-container>
  `,
})
export class DySortIconComponent {
  @Input() direction: DySortDirection = DySortDirection.NONE;

  isAscending(): boolean {
    return this.direction === DySortDirection.ASCENDING;
  }

  isDescending(): boolean {
    return this.direction === DySortDirection.DESCENDING;
  }

  isDirectionSet(): boolean {
    return this.isAscending() || this.isDescending();
  }
}

/**
 * Marks header as sort header so it emitting sort event when clicked.
 */
@Component({
  selector: '[dySortHeader]',
  template: `
    <button
      class="dy-tree-grid-header-change-sort-button"
      type="button"
      [attr.disabled]="getDisabledAttributeValue()"
      (click)="sortData()">
      <ng-content></ng-content>
    </button>
    <dy-sort-icon *ngIf="!sortIcon; else customIcon" [direction]="direction"></dy-sort-icon>
    <ng-template #customIcon [ngTemplateOutlet]="sortIcon" [ngTemplateOutletContext]="getIconContext()"></ng-template>
  `,
})
export class DySortHeaderComponent {

  @ContentChild(DySortHeaderIconDirective, { read: TemplateRef })
  sortIcon: TemplateRef<DySortHeaderIconDirectiveContext>;

  /**
   * Current sort direction. Possible values: `asc`, `desc`, ``(none)
   * @type {DySortDirection}
   */
  @Input('dySortHeader') direction: DySortDirection;
  static ngAcceptInputType_direction: DySortDirectionValues;

  private disabledValue: boolean = false;

  /**
   * Disable sort header
   */
  @Input()
  @HostBinding('class.disabled')
  set disabled(value) {
    this.disabledValue = convertToBoolProperty(value);
  }
  get disabled(): boolean {
    return this.disabledValue;
  }
  static ngAcceptInputType_disabled: DyBooleanInput;

  @HostListener('click')
  sortIfEnabled() {
    if (!this.disabled) {
      this.sortData();
    }
  }

  constructor(
    private sort: DySortDirective,
    @Inject(DY_SORT_HEADER_COLUMN_DEF) private columnDef: DySortHeaderColumnDef,
  ) {}

  isAscending(): boolean {
    return this.direction === DySortDirection.ASCENDING;
  }

  isDescending(): boolean {
    return this.direction === DySortDirection.DESCENDING;
  }

  sortData(): void {
    const sortRequest = this.createSortRequest();
    this.sort.emitSort(sortRequest);
  }

  getIconContext(): DySortHeaderIconDirectiveContext {
    return {
      $implicit: this.direction,
      isAscending: this.isAscending(),
      isDescending: this.isDescending(),
      isNone: !this.isAscending() && !this.isDescending(),
    };
  }

  getDisabledAttributeValue(): '' | null {
    return this.disabled ? '' : null;
  }

  private createSortRequest(): DySortRequest {
    this.direction = this.getNextDirection();
    return { direction: this.direction, column: this.columnDef.name };
  }

  private getNextDirection(): DySortDirection {
    const sortDirectionCycle = sortDirections;
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }
}
