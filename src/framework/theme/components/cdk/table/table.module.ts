import {
  Attribute,
  ChangeDetectorRef,
  ElementRef,
  Inject,
  IterableDiffers,
  NgModule,
  Component,
  Optional,
  Provider,
} from '@angular/core';
import {
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  CdkTable,
  CdkTableModule,
  RenderRow,
  RowContext,
} from '@angular/cdk/table';
import { _DisposeViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY, _ViewRepeater } from '@angular/cdk/collections';

import { DyBidiModule } from '../bidi/bidi.module';
import { DyDirectionality } from '../bidi/bidi-service';
import { DyPlatform } from '../platform/platform-service';
import { DY_DOCUMENT } from '../../../theme.options';
import {
  DyCellDefDirective,
  DyCellDirective,
  DyColumnDefDirective,
  DyFooterCellDefDirective,
  DyFooterCellDirective,
  DyHeaderCellDefDirective,
  DyHeaderCellDirective,
} from './cell';
import {
  DyCellOutletDirective,
  DyDataRowOutletDirective,
  DyFooterRowOutletDirective,
  DyHeaderRowOutletDirective,
  DyFooterRowComponent,
  DyFooterRowDefDirective,
  DyHeaderRowComponent,
  DyHeaderRowDefDirective,
  DyRowComponent,
  DyRowDefDirective,
  DyNoDataRowOutletDirective,
} from './row';

export const DY_TABLE_TEMPLATE = `
  <ng-container dyHeaderRowOutlet></ng-container>
  <ng-container dyRowOutlet></ng-container>
  <ng-container dyNoDataRowOutlet></ng-container>
  <ng-container dyFooterRowOutlet></ng-container>
`;

export const DY_VIEW_REPEATER_STRATEGY = _VIEW_REPEATER_STRATEGY;
export const DY_COALESCED_STYLE_SCHEDULER = _COALESCED_STYLE_SCHEDULER;

export const DY_TABLE_PROVIDERS: Provider[] = [
  { provide: DY_VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
  { provide: DY_COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
];

@Component({
  selector: 'dy-table-not-implemented',
  template: ``,
  providers: DY_TABLE_PROVIDERS,
})
// tslint:disable-next-line:component-class-suffix
export class DyTable<T> extends CdkTable<T> {
  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string,
    dir: DyDirectionality,
    @Inject(DY_DOCUMENT) document: any,
    platform: DyPlatform,
    @Optional() @Inject(_VIEW_REPEATER_STRATEGY)
    protected readonly _viewRepeater?: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
    @Optional() @Inject(_COALESCED_STYLE_SCHEDULER)
    protected readonly _coalescedStyleScheduler?: _CoalescedStyleScheduler,
  ) {
    super(differs, changeDetectorRef, elementRef, role, dir, document, platform, _viewRepeater,
          _coalescedStyleScheduler);
  }
}

const COMPONENTS = [
  DyTable,

  // Template defs
  DyHeaderCellDefDirective,
  DyHeaderRowDefDirective,
  DyColumnDefDirective,
  DyCellDefDirective,
  DyRowDefDirective,
  DyFooterCellDefDirective,
  DyFooterRowDefDirective,

  // Outlets
  DyDataRowOutletDirective,
  DyHeaderRowOutletDirective,
  DyFooterRowOutletDirective,
  DyNoDataRowOutletDirective,
  DyCellOutletDirective,

  // Cell directives
  DyHeaderCellDirective,
  DyCellDirective,
  DyFooterCellDirective,

  // Row directives
  DyHeaderRowComponent,
  DyRowComponent,
  DyFooterRowComponent,
];

@NgModule({
  imports: [ DyBidiModule ],
  declarations: [ ...COMPONENTS ],
  exports: [ ...COMPONENTS ],
})
export class DyTableModule extends CdkTableModule {}
