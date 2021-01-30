/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */


import { Injectable } from '@angular/core';

import { DyTreeGridPresentationNode } from './tree-grid.model';

export interface DyToggleOptions {
  deep?: boolean;
}

@Injectable()
export class DyTreeGridService<T> {
  expand(data: DyTreeGridPresentationNode<T>[], row: T, options: DyToggleOptions = {}) {
    const node: DyTreeGridPresentationNode<T> = this.find(data, row);
    node.expanded = true;

    if (options.deep && node.hasChildren()) {
      node.children.forEach((n: DyTreeGridPresentationNode<T>) => this.expand(data, n.data, options));
    }
  }

  collapse(data: DyTreeGridPresentationNode<T>[], row: T, options: DyToggleOptions = {}) {
    const node: DyTreeGridPresentationNode<T> = this.find(data, row);
    node.expanded = false;

    if (options.deep && node.hasChildren()) {
      node.children.forEach((n: DyTreeGridPresentationNode<T>) => this.collapse(data, n.data, options));
    }
  }

  toggle(data: DyTreeGridPresentationNode<T>[], row: T, options: DyToggleOptions = {}) {
    const node: DyTreeGridPresentationNode<T> = this.find(data, row);
    if (node.expanded) {
      this.collapse(data, row, options);
    } else {
      this.expand(data, row, options);
    }
  }

  private find(data: DyTreeGridPresentationNode<T>[], row: T): DyTreeGridPresentationNode<T> {
    const toCheck: DyTreeGridPresentationNode<T>[] = [...data];

    for (const node of toCheck) {
      if (node.data === row) {
        return node;
      }

      if (node.hasChildren()) {
        toCheck.push(...node.children);
      }
    }
  }
}
