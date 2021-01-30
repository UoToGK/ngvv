import { ModuleWithProviders, NgModule } from '@angular/core';

import { DySharedModule } from '../../shared/shared.module';
import { DyA11yModule } from '../a11y/a11y.module';
import { DyCdkMappingModule } from './mapping';
import { DyPositionBuilderService } from './overlay-position';
import { DyOverlayContainerComponent, DyPositionedContainerComponent } from './overlay-container';
import { DyOverlayService } from './overlay-service';
import { DyCdkAdapterModule } from '../adapter/adapter.module';
import { DyPositionHelper } from './position-helper';
import { DyTriggerStrategyBuilderService } from './overlay-trigger';


@NgModule({
  imports: [
    DyCdkMappingModule,
    DySharedModule,
  ],
  declarations: [
    DyPositionedContainerComponent,
    DyOverlayContainerComponent,
  ],
  exports: [
    DyCdkMappingModule,
    DyCdkAdapterModule,
    DyOverlayContainerComponent,
  ],
})
export class DyOverlayModule {
  static forRoot(): ModuleWithProviders<DyOverlayModule> {
    return {
      ngModule: DyOverlayModule,
      providers: [
        DyPositionBuilderService,
        DyTriggerStrategyBuilderService,
        DyOverlayService,
        DyPositionHelper,
        ...DyCdkMappingModule.forRoot().providers,
        ...DyCdkAdapterModule.forRoot().providers,
        ...DyA11yModule.forRoot().providers,
      ],
    };
  }
}
