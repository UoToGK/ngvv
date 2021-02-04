import { NgModule } from '@angular/core';
import { DyCardModule, DyIconModule, DyInputModule, DyProgressBarModule,
  DySpinnerModule,
  DyTreeGridModule, TableModule } from 'src/framework/theme/public_api';
// import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';
import { DyEvaIconsModule } from 'src/framework/theme/components/eva-icons/eva-icons.module';

@NgModule({
  imports: [
    DyCardModule,
    DyTreeGridModule,
    DyIconModule,
    DyEvaIconsModule,
    DyInputModule,
    ThemeModule,
    TablesRoutingModule,
    // Ng2SmartTableModule,
    TableModule,
    DySpinnerModule,
    DyProgressBarModule

  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
  ],
})
export class TablesModule { }
