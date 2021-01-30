

import {
  Component,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ContentChild,
  SimpleChanges,
  AfterContentInit,
  OnChanges,
} from '@angular/core';

import { DyStatusService } from '../../services/status.service';
import { DyComponentSize } from '../component-size';
import { DyComponentOrCustomStatus } from '../component-status';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyChatFormComponent } from './chat-form.component';
import { DyChatMessageComponent } from './chat-message.component';

/**
 * Conversational UI collection - a set of components for chat-like UI construction.
 *
 * Main features:
 * - different message types support (text, image, file, file group, map, etc)
 * - drag & drop for images and files with preview
 * - different UI styles
 * - custom action buttons (coming soon)
 *
 * Here's a complete example build in a bot-like app. Type `help` to be able to receive different message types.
 * Enjoy the conversation and the beautiful UI.
 * @stacked-example(Showcase, chat/chat-showcase.component)
 *
 * Basic chat configuration and usage:
 * ```ts
 * <dy-chat title="Nebular Conversational UI">
 *       <dy-chat-message *ngFor="let msg of messages"
 *                        [type]="msg.type"
 *                        [message]="msg.text"
 *                        [reply]="msg.reply"
 *                        [sender]="msg.user.name"
 *                        [date]="msg.date"
 *                        [files]="msg.files"
 *                        [quote]="msg.quote"
 *                        [latitude]="msg.latitude"
 *                        [longitude]="msg.longitude"
 *                        [avatar]="msg.user.avatar">
 *   </dy-chat-message>
 *
 *   <dy-chat-form (send)="sendMessage($event)" [dropFiles]="true">
 *   </dy-chat-form>
 * </dy-chat>
 * ```
 * ### Installation
 *
 * Import `DyChatModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyChatModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * If you need to provide an API key for a `map` message type (which is required by Google Maps)
 * you may use `DyChatModule.forRoot({ ... })` call if this is a global app configuration
 * or `DyChatModule.forChild({ ... })` for a feature module configuration:
 *
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyChatModule.forRoot({ messageGoogleMapKey: 'MAP_KEY' }),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * There are three main components:
 * ```ts
 * <dy-chat>
 * </dy-chat> // chat container
 *
 * <dy-chat-form>
 * </dy-chat-form> // chat form with drag&drop files feature
 *
 * <dy-chat-message>
 * </dy-chat-message> // chat message, available multiple types
 * ```
 *
 * Two users conversation showcase:
 * @stacked-example(Conversation, chat/chat-conversation-showcase.component)
 *
 * Chat UI is also available in different colors by specifying a `[status]` input:
 *
 * @stacked-example(Colored Chat, chat/chat-colors.component)
 *
 * Also it is possible to configure sizes through `[size]` input:
 *
 * @stacked-example(Chat Sizes, chat/chat-sizes.component)
 *
 * @styles
 *
 * chat-background-color:
 * chat-border:
 * chat-border-radius:
 * chat-shadow:
 * chat-padding:
 * chat-scrollbar-color:
 * chat-scrollbar-background-color:
 * chat-scrollbar-width:
 * chat-text-color:
 * chat-text-font-family:
 * chat-text-font-size:
 * chat-text-font-weight:
 * chat-text-line-height:
 * chat-header-text-font-family:
 * chat-header-text-font-size:
 * chat-header-text-font-weight:
 * chat-header-text-line-height:
 * chat-tiny-height:
 * chat-small-height:
 * chat-medium-height:
 * chat-large-height:
 * chat-giant-height:
 * chat-basic-background-color:
 * chat-basic-text-color:
 * chat-primary-background-color:
 * chat-primary-text-color:
 * chat-success-background-color:
 * chat-success-text-color:
 * chat-info-background-color:
 * chat-info-text-color:
 * chat-warning-background-color:
 * chat-warning-text-color:
 * chat-danger-background-color:
 * chat-danger-text-color:
 * chat-control-background-color:
 * chat-control-text-color:
 * chat-divider-color:
 * chat-divider-style:
 * chat-divider-width:
 * chat-message-background:
 * chat-message-text-color:
 * chat-message-reply-background-color:
 * chat-message-reply-text-color:
 * chat-message-avatar-background-color:
 * chat-message-sender-text-color:
 * chat-message-quote-background-color:
 * chat-message-quote-text-color:
 * chat-message-file-text-color:
 * chat-message-file-background-color:
 */
@Component({
  selector: 'dy-chat',
  styleUrls: ['./chat.component.scss'],
  template: `
    <div class="header">{{ title }}</div>
    <div class="scrollable" #scrollable>
      <div class="messages">
        <ng-content select="dy-chat-message"></ng-content>
        <p class="no-messages" *ngIf="!messages?.length">{{ noMessagesPlaceholder }}</p>
      </div>
    </div>
    <div class="form">
      <ng-content select="dy-chat-form"></ng-content>
    </div>
  `,
})
export class DyChatComponent implements OnChanges, AfterContentInit, AfterViewInit {

  @Input() title: string;

  /**
   * Chat size, available sizes:
   * `tiny`, `small`, `medium`, `large`, `giant`
   */
  @Input() size: DyComponentSize;

  /**
   * Chat status color (adds specific styles):
   * `basic` (default), `primary`, `success`, `info`, `warning`, `danger`, `control`.
   */
  @Input() status: DyComponentOrCustomStatus = 'basic';

  @Input() noMessagesPlaceholder: string = 'No messages yet.';

  /**
   * Scroll chat to the bottom of the list when a new message arrives
   */
  @Input()
  get scrollBottom(): boolean {
    return this._scrollBottom
  }
  set scrollBottom(value: boolean) {
    this._scrollBottom = convertToBoolProperty(value);
  }
  protected _scrollBottom: boolean = true;
  static ngAcceptInputType_scrollBottom: DyBooleanInput;

  @ViewChild('scrollable') scrollable: ElementRef;
  @ContentChildren(DyChatMessageComponent) messages: QueryList<DyChatMessageComponent>;
  @ContentChild(DyChatFormComponent) chatForm: DyChatFormComponent;

  constructor(protected statusService: DyStatusService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('status' in changes) {
      this.updateFormStatus();
    }
  }

  ngAfterContentInit() {
    this.updateFormStatus();
  }

  ngAfterViewInit() {
    this.messages.changes
      .subscribe((messages) => {
        this.messages = messages;
        this.updateView();
      });

    this.updateView();
  }

  updateView() {
    if (this.scrollBottom) {
      this.scrollListBottom();
    }
  }

  scrollListBottom() {
    this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
  }

  protected updateFormStatus(): void {
    if (this.chatForm) {
      this.chatForm.setStatus(this.status);
    }
  }

  @HostBinding('class.size-tiny')
  get tiny(): boolean {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small')
  get small(): boolean {
    return this.size === 'small';
  }

  @HostBinding('class.size-medium')
  get medium(): boolean {
    return this.size === 'medium';
  }

  @HostBinding('class.size-large')
  get large(): boolean {
    return this.size === 'large';
  }

  @HostBinding('class.size-giant')
  get giant(): boolean {
    return this.size === 'giant';
  }

  @HostBinding('class.status-primary')
  get primary(): boolean {
    return this.status === 'primary';
  }

  @HostBinding('class.status-success')
  get success(): boolean {
    return this.status === 'success';
  }

  @HostBinding('class.status-info')
  get info(): boolean {
    return this.status === 'info';
  }

  @HostBinding('class.status-warning')
  get warning(): boolean {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger(): boolean {
    return this.status === 'danger';
  }

  @HostBinding('class.status-basic')
  get basic(): boolean {
    return this.status === 'basic';
  }

  @HostBinding('class.status-control')
  get control(): boolean {
    return this.status === 'control';
  }

  @HostBinding('class')
  get additionalClasses(): string[] {
    if (this.statusService.isCustomStatus(this.status)) {
      return [this.statusService.getStatusClass(this.status)];
    }
    return [];
  }
}
