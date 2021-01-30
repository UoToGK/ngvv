/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';

import { DyGetters, DY_DEFAULT_ROW_LEVEL, DyTreeGridPresentationNode } from './tree-grid.model';

@Injectable()
export class DyTreeGridDataService<T> {

  private defaultGetters: DyGetters<any, T> = {
    dataGetter: node => node.data,
    childrenGetter: d => d.children || undefined,
    expandedGetter: d => !!d.expanded,
  };

  toPresentationNodes<N>(
    nodes: N[],
    customGetters?: DyGetters<N, T>,
    level: number = DY_DEFAULT_ROW_LEVEL,
  ): DyTreeGridPresentationNode<T>[] {
    const getters: DyGetters<N, T> = { ...this.defaultGetters, ...customGetters };

    return this.mapNodes(nodes, getters, level);
  }

  private mapNodes<N>(nodes: N[], getters: DyGetters<N, T>, level: number): DyTreeGridPresentationNode<T>[] {
    const { dataGetter, childrenGetter, expandedGetter } = getters;

    return nodes.map(node => {
      const childrenNodes = childrenGetter(node);
      let children: DyTreeGridPresentationNode<T>[];
      if (childrenNodes) {
        children = this.toPresentationNodes(childrenNodes, getters, level + 1);
      }

      return new DyTreeGridPresentationNode(dataGetter(node), children, expandedGetter(node), level);
    });
  }

  flattenExpanded(nodes: DyTreeGridPresentationNode<T>[]): DyTreeGridPresentationNode<T>[] {
    return nodes.reduce((res: DyTreeGridPresentationNode<T>[], node: DyTreeGridPresentationNode<T>) => {
      res.push(node);

      if (node.expanded && node.hasChildren()) {
        res.push(...this.flattenExpanded(node.children));
      }

      return res;
    }, []);
  }

  copy(nodes: DyTreeGridPresentationNode<T>[]): DyTreeGridPresentationNode<T>[] {
    return nodes.map((node: DyTreeGridPresentationNode<T>) => {
      let children: DyTreeGridPresentationNode<T>[];
      if (node.hasChildren()) {
        children = this.copy(node.children);
      }
      return new DyTreeGridPresentationNode(node.data, children, node.expanded, node.level);
    });
  }
}
