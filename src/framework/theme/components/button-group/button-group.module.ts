

import { NgModule } from '@angular/core';
import { DyButtonGroupComponent } from './button-group.component';
import { DyButtonToggleDirective } from './button-toggle.directive';

@NgModule({
  declarations: [ DyButtonGroupComponent, DyButtonToggleDirective ],
  exports: [ DyButtonGroupComponent, DyButtonToggleDirective ],
})
export class DyButtonGroupModule { }
