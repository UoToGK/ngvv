

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyContextMenuDirective } from './context-menu.directive';
import { DyContextMenuComponent } from './context-menu.component';
import { DyMenuModule } from '../menu/menu.module';


@NgModule({
  imports: [CommonModule, DyOverlayModule, DyMenuModule],
  exports: [DyContextMenuDirective],
  declarations: [DyContextMenuDirective, DyContextMenuComponent],
  entryComponents: [DyContextMenuComponent],
})
export class DyContextMenuModule {
}
