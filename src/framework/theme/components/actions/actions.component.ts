

import { Component, HostBinding, Input } from '@angular/core';

import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyComponentSize } from '../component-size';
import { DyComponentOrCustomStatus } from '../component-status';
import { DyBadgePosition } from '../badge/badge.component';
import { DyIconConfig } from '../icon/icon.component';

/**
 * Action item, display a link with an icon, or any other content provided instead.
 */
@Component({
  selector: 'dy-action',
  styleUrls: ['./action.component.scss'],
  template: `
    <ng-container *ngIf="icon; else projectedContent">
      <a class="icon-container"
         [routerLink]="link"
         [title]="title"
         *ngIf="link">
        <dy-icon [config]="icon"></dy-icon>
        <ng-container [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
      <a class="icon-container"
         [href]="href"
         [title]="title"
         *ngIf="href && !link">
        <dy-icon [config]="icon"></dy-icon>
        <ng-container [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
      <a class="icon-container"
         href="#"
         [title]="title"
         *ngIf="!href && !link"
         (click)="$event.preventDefault()">
        <dy-icon [config]="icon"></dy-icon>
        <ng-container [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
    </ng-container>

    <ng-template #projectedContent>
      <ng-content></ng-content>
      <ng-container [ngTemplateOutlet]="badgeTemplate"></ng-container>
    </ng-template>
    <ng-template #badgeTemplate>
      <dy-badge *ngIf="badgeText || badgeDot"
                [text]="badgeText"
                [dotMode]="badgeDot"
                [status]="badgeStatus"
                [position]="badgePosition">
      </dy-badge>
    </ng-template>
  `,
})
export class DyActionComponent {

  /**
   * Router link to use
   * @type string
   */
  @Input() link: string;

  /**
   * Regular HREF link
   * @type: string
   */
  @Input() href: string;

  /**
   * Optional title for mouseover
   * @type string
   */
  @Input() title: string = '';

  /**
   * Icon name or config object
   * @type {string | DyIconConfig}
   */
  @Input() icon: string | DyIconConfig;

  /**
   * Visually disables the item
   * @type boolean
   */
  @Input()
  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = convertToBoolProperty(value);
  }
  protected _disabled: boolean = false;
  static ngAcceptInputType_disabled: DyBooleanInput;

  /**
   * Use badge dot mode
   * @type boolean
   */
  @Input()
  get badgeDot(): boolean {
    return this._badgeDot;
  }
  set badgeDot(value: boolean) {
    this._badgeDot = convertToBoolProperty(value);
  }
  protected _badgeDot: boolean;
  static ngAcceptInputType_badgeDot: DyBooleanInput;

  /**
   * Badge text to display
   * @type string
   */
  @Input() badgeText: string;

  /**
   * Badge status (adds specific styles):
   * 'basic', 'primary', 'info', 'success', 'warning', 'danger', 'control'
   * @param {string} val
   */
  @Input() badgeStatus: DyComponentOrCustomStatus = 'basic';

  /**
   * Badge position.
   * Can be set to any class or to one of predefined positions:
   * 'top left', 'top right', 'bottom left', 'bottom right',
   * 'top start', 'top end', 'bottom start', 'bottom end'
   * @type string
   */
  @Input() badgePosition: DyBadgePosition;
}

/**
 * Shows a horizontal list of actions, available in multiple sizes.
 * Aligns items vertically.
 *
 * @stacked-example(Showcase, action/action-showcase.component)
 *
 * Basic actions setup:
 * ```html
 * <dy-actions size="small">
 *   <dy-action icon="dy-search"></dy-action>
 *   <dy-action icon="dy-power-circled"></dy-action>
 *   <dy-action icon="dy-person"></dy-action>
 * </dy-actions>
 * ```
 * ### Installation
 *
 * Import `DyActionsModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyActionsModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Multiple sizes example:
 * @stacked-example(Multiple Sizes, action/action-sizes.component)
 *
 * It is also possible to specify a `badge` value:
 *
 * @stacked-example(Action Badge, action/action-badge.component)
 *
 * and we can set it to full a width of a parent component
 * @stacked-example(Full Width, action/action-width.component)
 *
 * Action dot mode
 * @stacked-example(Action badge in dot mode, action/action-dot-mode.component)
 *
 * @styles
 *
 * actions-background-color:
 * actions-divider-color:
 * actions-divider-style:
 * actions-divider-width:
 * actions-icon-color:
 * actions-text-color:
 * actions-text-font-family:
 * actions-text-font-weight:
 * actions-text-line-height:
 * actions-disabled-icon-color:
 * actions-disabled-text-color:
 * actions-tiny-height:
 * actions-tiny-icon-height:
 * actions-tiny-padding:
 * actions-tiny-text-font-size:
 * actions-small-height:
 * actions-small-icon-height:
 * actions-small-padding:
 * actions-small-text-font-size:
 * actions-medium-height:
 * actions-medium-icon-height:
 * actions-medium-padding:
 * actions-medium-text-font-size:
 * actions-large-height:
 * actions-large-icon-height:
 * actions-large-padding:
 * actions-large-text-font-size:
 * actions-giant-height:
 * actions-giant-icon-height:
 * actions-giant-padding:
 * actions-giant-text-font-size:
 */
@Component({
  selector: 'dy-actions',
  styleUrls: ['./actions.component.scss'],
  template: `
    <ng-content select="dy-action"></ng-content>
  `,
})
export class DyActionsComponent {

  /**
   * Size of the component: 'tiny', 'small' (default), 'medium', 'large', 'giant'
   */
  @Input()
  get size(): DyComponentSize {
    return this._size;
  }
  set size(value: DyComponentSize) {
    this._size = value;
  }
  protected _size: DyComponentSize = 'small';

  /**
   * Component will fill full width of the container
   */
  @Input()
  @HostBinding('class.full-width')
  get fullWidth(): boolean {
    return this._fullWidth;
  }
  set fullWidth(value: boolean) {
    this._fullWidth = convertToBoolProperty(value);
  }
  protected _fullWidth: boolean = false;
  static ngAcceptInputType_fullWidth: DyBooleanInput;

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
}
