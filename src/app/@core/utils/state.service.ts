import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf,  Observable,  BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { DyLayoutDirectionService, DyLayoutDirection } from 'src/framework/theme/public_api';

@Injectable()
export class StateService implements OnDestroy {

  protected layouts: any = [
    {
      name: 'One Column',
      icon: 'dy-layout-default',
      id: 'one-column',
      selected: true,
    },
    {
      name: 'Two Column',
      icon: 'dy-layout-two-column',
      id: 'two-column',
    },
    {
      name: 'Center Column',
      icon: 'dy-layout-centre',
      id: 'center-column',
    },
  ];

  protected sidebars: any = [
    {
      name: 'Sidebar at layout start',
      icon: 'dy-layout-sidebar-left',
      id: 'start',
      selected: true,
    },
    {
      name: 'Sidebar at layout end',
      icon: 'dy-layout-sidebar-right',
      id: 'end',
    },
  ];

  protected layoutState$ = new BehaviorSubject(this.layouts[0]);
  protected sidebarState$ = new BehaviorSubject(this.sidebars[0]);

  alive = true;

  constructor(directionService: DyLayoutDirectionService) {
    directionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(direction => this.updateSidebarIcons(direction));

    this.updateSidebarIcons(directionService.getDirection());
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private updateSidebarIcons(direction: DyLayoutDirection) {
    const [ startSidebar, endSidebar ] = this.sidebars;
    const isLtr = direction === DyLayoutDirection.LTR;
    const startIconClass = isLtr ? 'dy-layout-sidebar-left' : 'dy-layout-sidebar-right';
    const endIconClass = isLtr ? 'dy-layout-sidebar-right' : 'dy-layout-sidebar-left';
    startSidebar.icon = startIconClass;
    endSidebar.icon = endIconClass;
  }

  setLayoutState(state: any): any {
    this.layoutState$.next(state);
  }

  getLayoutStates(): Observable<any[]> {
    return observableOf(this.layouts);
  }

  onLayoutState(): Observable<any> {
    return this.layoutState$.asObservable();
  }

  setSidebarState(state: any): any {
    this.sidebarState$.next(state);
  }

  getSidebarStates(): Observable<any[]> {
    return observableOf(this.sidebars);
  }

  onSidebarState(): Observable<any> {
    return this.sidebarState$.asObservable();
  }
}
