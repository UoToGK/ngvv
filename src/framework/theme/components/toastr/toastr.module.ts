

import { ModuleWithProviders, NgModule } from '@angular/core';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DySharedModule } from '../shared/shared.module';
import { DyIconModule } from '../icon/icon.module';

import { DyToastrContainerRegistry, DyToastrService } from './toastr.service';
import { DyToastComponent } from './toast.component';
import { DyToastrContainerComponent } from './toastr-container.component';
import { DY_TOASTR_CONFIG, DyToastrConfig } from './toastr-config';


@NgModule({
  imports: [DySharedModule, DyOverlayModule, DyIconModule],
  declarations: [DyToastrContainerComponent, DyToastComponent],
  entryComponents: [DyToastrContainerComponent, DyToastComponent],
})
export class DyToastrModule {
  static forRoot(toastrConfig: Partial<DyToastrConfig> = {}): ModuleWithProviders<DyToastrModule> {
    return {
      ngModule: DyToastrModule,
      providers: [
        DyToastrService,
        DyToastrContainerRegistry,
        { provide: DY_TOASTR_CONFIG, useValue: toastrConfig },
      ],
    };
  }
}
