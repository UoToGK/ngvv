

import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DyToastComponent } from './toast.component';
import { DyToast } from './model';
import { DyLayoutDirectionService } from '../../services/direction.service';
import { DyGlobalPosition, DyPositionHelper } from '../cdk/overlay/position-helper';

const voidState = style({
  transform: 'translateX({{ direction }}110%)',
  height: 0,
  marginLeft: '0',
  marginRight: '0',
  marginTop: '0',
  marginBottom: '0',
});

const defaultOptions = { params: { direction: '' } };

@Component({
  selector: 'dy-toastr-container',
  template: `
    <dy-toast [@fadeIn]="fadeIn" *ngFor="let toast of content" [toast]="toast"></dy-toast>`,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [voidState, animate(100)], defaultOptions),
      transition(':leave', [animate(100, voidState)], defaultOptions),
    ]),
  ],
})
export class DyToastrContainerComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  @Input()
  content: DyToast[] = [];

  @Input()
  context: Object;

  @Input()
  position: DyGlobalPosition;

  @ViewChildren(DyToastComponent)
  toasts: QueryList<DyToastComponent>;

  fadeIn;

  constructor(protected layoutDirection: DyLayoutDirectionService,
              protected positionHelper: DyPositionHelper) {
  }

  ngOnInit() {
    this.layoutDirection.onDirectionChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onDirectionChange());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onDirectionChange() {
    const direction = this.positionHelper.isRightPosition(this.position) ? '' : '-';
    this.fadeIn = { value: '', params: { direction } };
  }
}
