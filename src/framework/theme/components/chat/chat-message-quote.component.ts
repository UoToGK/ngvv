

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Chat message component.
 */
@Component({
  selector: 'dy-chat-message-quote',
  template: `
    <p class="sender" *ngIf="sender || date">{{ sender }} <time>{{ date | date: dateFormat }}</time></p>
    <p class="quote">
      {{ quote }}
    </p>
    <dy-chat-message-text [message]="message">
      {{ message }}
    </dy-chat-message-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyChatMessageQuoteComponent {

  /**
   * Message sender
   * @type {string}
   */
  @Input() message: string;

  /**
   * Message sender
   * @type {string}
   */
  @Input() sender: string;

  /**
   * Message send date
   * @type {Date}
   */
  @Input() date: Date;

 /**
   * Message send date format, default 'shortTime'
   * @type {string}
   */
  @Input() dateFormat: string = 'shortTime';

  /**
   * Quoted message
   * @type {Date}
   */
  @Input() quote: string;

}
