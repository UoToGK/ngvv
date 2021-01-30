

import { ModuleWithProviders, NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyButtonModule } from '../button/button.module';
import { DyInputModule } from '../input/input.module';
import { DyIconModule } from '../icon/icon.module';

import { DyChatComponent } from './chat.component';
import { DyChatMessageComponent } from './chat-message.component';
import { DyChatFormComponent } from './chat-form.component';
import { DyChatMessageTextComponent } from './chat-message-text.component';
import { DyChatMessageFileComponent } from './chat-message-file.component';
import { DyChatMessageQuoteComponent } from './chat-message-quote.component';
import { DyChatMessageMapComponent } from './chat-message-map.component';
import { DyChatOptions } from './chat.options';

const DY_CHAT_COMPONENTS = [
  DyChatComponent,
  DyChatMessageComponent,
  DyChatFormComponent,
  DyChatMessageTextComponent,
  DyChatMessageFileComponent,
  DyChatMessageQuoteComponent,
  DyChatMessageMapComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
    DyInputModule,
    DyButtonModule,
  ],
  declarations: [
    ...DY_CHAT_COMPONENTS,
  ],
  exports: [
    ...DY_CHAT_COMPONENTS,
  ],
})
export class DyChatModule {

  static forRoot(options?: DyChatOptions): ModuleWithProviders<DyChatModule> {
    return {
      ngModule: DyChatModule,
      providers: [
        { provide: DyChatOptions, useValue: options || {} },
      ],
    };
  }

  static forChild(options?: DyChatOptions): ModuleWithProviders<DyChatModule> {
    return {
      ngModule: DyChatModule,
      providers: [
        { provide: DyChatOptions, useValue: options || {} },
      ],
    };
  }
}
