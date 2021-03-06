/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export const DY_DEFAULT_ROW_LEVEL: number = 0;

export type DyDataGetter<N, T> = (N) => T;
export type DyChildrenGetter<N, T> = (N) => (T[] | undefined);
export type DyExpandedGetter<N> = (N) => boolean;

export interface DyGetters<N, T> {
  dataGetter?: DyDataGetter<N, T>;
  childrenGetter?: DyChildrenGetter<N, T>;
  expandedGetter?: DyExpandedGetter<N>;
}

/**
 * Implicit context of cells and rows
 */
export class DyTreeGridPresentationNode<T> {
  constructor(
    /**
     * Data object associated with row
     */
    public readonly data: T,
    public children: DyTreeGridPresentationNode<T>[] | undefined,
    /**
     * Row expand state
     */
    public expanded: boolean,
    public readonly level: number,
  ) {}

  /**
   * True if row has child rows
   */
  hasChildren(): boolean {
    return !!this.children && !!this.children.length;
  }
}
