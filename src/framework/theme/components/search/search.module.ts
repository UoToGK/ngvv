
import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyIconModule } from '../icon/icon.module';
import { DyButtonModule } from '../button/button.module';

import { DySearchComponent, DySearchFieldComponent } from './search.component';
import { DySearchService } from './search.service';


@NgModule({
  imports: [
    DySharedModule,
    DyOverlayModule,
    DyIconModule,
    DyButtonModule,
  ],
  declarations: [
    DySearchComponent,
    DySearchFieldComponent,
  ],
  exports: [
    DySearchComponent,
    DySearchFieldComponent,
  ],
  providers: [
    DySearchService,
  ],
  entryComponents: [
    DySearchFieldComponent,
  ],
})
export class DySearchModule {
}
