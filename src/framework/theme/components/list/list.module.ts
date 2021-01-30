import { NgModule } from '@angular/core';
import { DyListComponent, DyListItemComponent } from './list.component';
import { DyListPageTrackerDirective } from './list-page-tracker.directive';
import { DyInfiniteListDirective } from './infinite-list.directive';

const components = [
  DyListComponent,
  DyListItemComponent,
  DyListPageTrackerDirective,
  DyInfiniteListDirective,
];

@NgModule({
  declarations: components,
  exports: components,
})
export class DyListModule {}
