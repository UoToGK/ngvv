

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DyChatOptions } from './chat.options';

/**
 * Chat message component.
 */
@Component({
  selector: 'dy-chat-message-map',
  template: `
    <dy-chat-message-file [files]="[file]" [message]="message" [sender]="sender" [date]="date"
     [dateFormat]="dateFormat"></dy-chat-message-file>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyChatMessageMapComponent {

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
   * Map latitude
   * @type {number}
   */
  @Input() latitude: number;

  /**
   * Map longitude
   * @type {number}
   */
  @Input() longitude: number;

  get file() {
    return {
      // tslint:disable-next-line:max-line-length
      url: `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=12&size=400x400&key=${this.mapKey}`,
      type: 'image/png',
      icon: 'location',
    };
  }

  mapKey: string;

  constructor(options: DyChatOptions) {
    this.mapKey = options.messageGoogleMapKey;
  }
}
