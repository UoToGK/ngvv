

import { ModuleWithProviders, NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyDialogService } from './dialog.service';
import { DyDialogContainerComponent } from './dialog-container';
import { DY_DIALOG_CONFIG, DyDialogConfig } from './dialog-config';


@NgModule({
  imports: [DySharedModule, DyOverlayModule],
  declarations: [DyDialogContainerComponent],
  entryComponents: [DyDialogContainerComponent],
})
export class DyDialogModule {
  static forRoot(dialogConfig: Partial<DyDialogConfig> = {}): ModuleWithProviders<DyDialogModule> {
    return {
      ngModule: DyDialogModule,
      providers: [
        DyDialogService,
        { provide: DY_DIALOG_CONFIG, useValue: dialogConfig },
      ],
    }
  }

  static forChild(dialogConfig: Partial<DyDialogConfig> = {}): ModuleWithProviders<DyDialogModule> {
    return {
      ngModule: DyDialogModule,
      providers: [
        DyDialogService,
        { provide: DY_DIALOG_CONFIG, useValue: dialogConfig },
      ],
    }
  }
}
