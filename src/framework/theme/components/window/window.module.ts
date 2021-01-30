import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyCardModule } from '../card/card.module';
import { DyIconModule } from '../icon/icon.module';
import { DyButtonModule } from '../button/button.module';
import { DyWindowService } from './window.service';
import { DyWindowsContainerComponent } from './windows-container.component';
import { DyWindowComponent } from './window.component';
import { DY_WINDOW_CONFIG, DyWindowConfig } from './window.options';

@NgModule({
  imports: [ CommonModule, DyOverlayModule, DyCardModule, DyIconModule, DyButtonModule ],
  declarations: [
    DyWindowsContainerComponent,
    DyWindowComponent,
  ],
  entryComponents: [DyWindowsContainerComponent, DyWindowComponent],
})
export class DyWindowModule {
  static forRoot(defaultConfig?: Partial<DyWindowConfig>): ModuleWithProviders<DyWindowModule> {
    return {
      ngModule: DyWindowModule,
      providers: [
        DyWindowService,
        { provide: DY_WINDOW_CONFIG, useValue: defaultConfig },
      ],
    };
  }

  static forChild(defaultConfig?: Partial<DyWindowConfig>): ModuleWithProviders<DyWindowModule> {
    return {
      ngModule: DyWindowModule,
      providers: [
        DyWindowService,
        { provide: DY_WINDOW_CONFIG, useValue: defaultConfig },
      ],
    };
  }
}
