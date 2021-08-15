import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SpiderMainRoutingModule } from './spider-main-routing.module';
import { SpiderMainComponent } from './spider-main.component';
import { CoreModule } from 'src/app/@core/core.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DySidebarModule, DyMenuModule, DyDatepickerModule, DyDialogModule, DyWindowModule, DyToastrModule, DyChatModule } from 'src/framework/theme/public_api';


@NgModule({
  declarations: [SpiderMainComponent],
  imports: [
    SpiderMainRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DySidebarModule.forRoot(),
    DyMenuModule.forRoot(),
    DyDatepickerModule.forRoot(),
    DyDialogModule.forRoot(),
    DyWindowModule.forRoot(),
    DyToastrModule.forRoot(),
    DyChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap:[SpiderMainComponent]
})
export class SpiderMainModule { }
