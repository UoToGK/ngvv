import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DyAccordionModule,
  DyButtonModule,
  DyCardModule,
  DyListModule,
  DyRouteTabsetModule,
  DyStepperModule,
  DyTabsetModule, DyUserModule,
} from 'src/framework/theme/public_api';

import { ThemeModule } from '../../@theme/theme.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { Tab1Component, Tab2Component, TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ListComponent } from './list/list.component';
import { InfiniteListComponent } from './infinite-list/infinite-list.component';
import { NewsPostComponent } from './infinite-list/news-post/news-post.component';
import { NewsPostPlaceholderComponent } from './infinite-list/news-post-placeholder/news-post-placeholder.component';
import { AccordionComponent } from './accordion/accordion.component';
import { NewsService } from './news.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    DyTabsetModule,
    DyRouteTabsetModule,
    DyStepperModule,
    DyCardModule,
    DyButtonModule,
    DyListModule,
    DyAccordionModule,
    DyUserModule,
    LayoutRoutingModule,
  ],
  declarations: [
    LayoutComponent,
    TabsComponent,
    Tab1Component,
    Tab2Component,
    StepperComponent,
    ListComponent,
    NewsPostPlaceholderComponent,
    InfiniteListComponent,
    NewsPostComponent,
    AccordionComponent,
  ],
  providers: [
    NewsService,
  ],
})
export class LayoutModule { }
