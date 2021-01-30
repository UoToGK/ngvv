/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */


import { Injectable } from '@angular/core';
import { DySortDirection, DySortRequest } from '../tree-grid-sort.component';
import { DyTreeGridPresentationNode } from './tree-grid.model';

/**
 * Service used to sort tree grid data. Uses Array.prototype.sort method.
 * If you need custom sorting, you can extend this service and override comparator or whole sort method.
 */
@Injectable()
export class DyTreeGridSortService<T> {

  sort(request: DySortRequest, data: DyTreeGridPresentationNode<T>[]): DyTreeGridPresentationNode<T>[] {
    if (!request) {
      return data;
    }

    const sorted = data.sort((na, dy) => this.comparator(request, na, dy));
    for (const node of data) {
      if (node.children) {
        node.children = this.sort(request, node.children);
      }
    }
    return sorted;
  }

  protected comparator(
    request: DySortRequest,
    na: DyTreeGridPresentationNode<T>,
    dy: DyTreeGridPresentationNode<T>,
  ): number {
    const key = request.column;
    const dir = request.direction;
    const a = na.data[key];
    const b = dy.data[key];

    let res = 0;

    if (a > b) {
      res = 1
    }
    if (a < b) {
      res = -1
    }

    return dir === DySortDirection.ASCENDING ? res : res * -1;
  }
}
