/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DyCollectionViewer } from '../../cdk/collections/collection-viewer';
import { DyDataSource } from '../../cdk/table/data-source';
import { DySortable, DySortRequest } from '../tree-grid-sort.component';
import { DyTreeGridDataService } from './tree-grid-data.service';
import { DyTreeGridFilterService } from './tree-grid-filter.service';
import { DyTreeGridSortService } from './tree-grid-sort.service';
import { DyGetters, DY_DEFAULT_ROW_LEVEL, DyTreeGridPresentationNode } from './tree-grid.model';
import { DyToggleOptions, DyTreeGridService } from './tree-grid.service';

export interface DyFilterable {
  filter(filterRequest: string);
}

export class DyTreeGridDataSource<T> extends DyDataSource<DyTreeGridPresentationNode<T>>
                                     implements DySortable, DyFilterable {
  /** Stream that emits when a new data array is set on the data source. */
  private data: BehaviorSubject<DyTreeGridPresentationNode<T>[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly renderData = new BehaviorSubject<DyTreeGridPresentationNode<T>[]>([]);

  private readonly filterRequest = new BehaviorSubject<string>('');

  private readonly sortRequest = new BehaviorSubject<DySortRequest>(null);

  constructor(private sortService: DyTreeGridSortService<T>,
              private filterService: DyTreeGridFilterService<T>,
              private treeGridService: DyTreeGridService<T>,
              private treeGridDataService: DyTreeGridDataService<T>) {
    super();
  }

  setData<N>(data: N[], customGetters?: DyGetters<N, T>) {
    let presentationData: DyTreeGridPresentationNode<T>[] = [];
    if (data) {
      presentationData = this.treeGridDataService.toPresentationNodes(data, customGetters);
    }

    this.data = new BehaviorSubject(presentationData);
    this.updateChangeSubscription();
  }

  connect(
    collectionViewer: DyCollectionViewer,
  ): Observable<DyTreeGridPresentationNode<T>[] | ReadonlyArray<DyTreeGridPresentationNode<T>>> {
    return this.renderData;
  }

  disconnect(collectionViewer: DyCollectionViewer) {
  }

  expand(row: T) {
    this.treeGridService.expand(this.data.value, row);
    this.data.next(this.data.value);
  }

  collapse(row: T) {
    this.treeGridService.collapse(this.data.value, row);
    this.data.next(this.data.value);
  }

  toggle(row: T, options?: DyToggleOptions) {
    this.treeGridService.toggle(this.data.value, row, options);
    this.data.next(this.data.value);
  }

  toggleByIndex(dataIndex: number, options?: DyToggleOptions) {
    const node: DyTreeGridPresentationNode<T> = this.renderData.value && this.renderData.value[dataIndex];
    if (node) {
      this.toggle(node.data, options);
    }
  }

  getLevel(rowIndex: number): number {
    const row = this.renderData.value[rowIndex];
    return row ? row.level : DY_DEFAULT_ROW_LEVEL;
  }

  sort(sortRequest: DySortRequest) {
    this.sortRequest.next(sortRequest);
  }

  filter(searchQuery: string) {
    this.filterRequest.next(searchQuery);
  }

  protected updateChangeSubscription() {
    const dataStream = this.data;

    const filteredData = combineLatest(dataStream, this.filterRequest)
      .pipe(
        map(([data]) => this.treeGridDataService.copy(data)),
        map(data => this.filterData(data)),
      );

    const sortedData = combineLatest(filteredData, this.sortRequest)
      .pipe(
        map(([data]) => this.sortData(data)),
      );

    sortedData
      .pipe(
        map((data: DyTreeGridPresentationNode<T>[]) => this.treeGridDataService.flattenExpanded(data)),
      )
      .subscribe((data: DyTreeGridPresentationNode<T>[]) => this.renderData.next(data));
  }

  private filterData(data: DyTreeGridPresentationNode<T>[]): DyTreeGridPresentationNode<T>[] {
    return this.filterService.filter(this.filterRequest.value, data);
  }

  private sortData(data: DyTreeGridPresentationNode<T>[]): DyTreeGridPresentationNode<T>[] {
    return this.sortService.sort(this.sortRequest.value, data);
  }
}

@Injectable()
export class DyTreeGridDataSourceBuilder<T> {
  constructor(private filterService: DyTreeGridFilterService<T>,
              private sortService: DyTreeGridSortService<T>,
              private treeGridService: DyTreeGridService<T>,
              private treeGridDataService: DyTreeGridDataService<T>) {
  }

  create<N>(data: N[], customGetters?: DyGetters<N, T>): DyTreeGridDataSource<T> {
    const dataSource = new DyTreeGridDataSource<T>(
      this.sortService,
      this.filterService,
      this.treeGridService,
      this.treeGridDataService,
    );

    dataSource.setData(data, customGetters);
    return dataSource;
  }
}
