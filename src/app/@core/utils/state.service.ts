import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf,  Observable,  BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DyLayoutDirectionService, DyLayoutDirection } from 'src/framework/theme/public_api';



@Injectable()
export class StateService implements OnDestroy {

  protected layouts: any = [
    {
      name: '单列布局',
      icon: 'minus-outline',
      id: 'one-column',
      selected: true,
    },
    {
      name: '双列布局',
      icon: 'arrowhead-right-outline',
      id: 'two-column',
    },
    {
      name: '中间列布局',
      icon: 'bar-chart-2-outline',
      id: 'center-column',
    },
  ];

  protected sidebars: any = [
    {
      name: '侧栏左侧',
      icon: 'arrow-left-outline',
      id: 'start',
      selected: true,
    },
    {
      name: '侧栏右侧',
      icon: 'arrow-right-outline',
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
    const startIconClass = isLtr ? 'arrow-left-outline' : 'arrow-right-outline';
    const endIconClass = isLtr ? 'arrow-right-outline' : 'arrow-left-outline';
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
