

import { Component, Input, HostBinding } from '@angular/core';

import { DyStatusService } from '../../services/status.service';
import { DyComponentSize } from '../component-size';
import { DyComponentOrCustomStatus, DyComponentStatus } from '../component-status';

/**
 * Component intended to be used within the `<dy-card>` component.
 * It adds styles for a preset header section.
 *
 * @styles
 *
 * card-header-text-color:
 * card-header-text-font-family:
 * card-header-text-font-size:
 * card-header-text-font-weight:
 * card-header-text-line-height:
 * card-header-basic-background-color:
 * card-header-basic-text-color:
 * card-header-primary-background-color:
 * card-header-primary-text-color:
 * card-header-info-background-color:
 * card-header-info-text-color:
 * card-header-success-background-color:
 * card-header-success-text-color:
 * card-header-warning-background-color:
 * card-header-warning-text-color:
 * card-header-danger-background-color:
 * card-header-danger-text-color:
 * card-header-control-background-color:
 * card-header-control-text-color:
 */
@Component({
  selector: 'dy-card-header',
  template: `<ng-content></ng-content>`,
})
export class DyCardHeaderComponent {
}

/**
 * Component intended to be used within  the `<dy-card>` component.
 * Adds styles for a preset body section.
 */
@Component({
  selector: 'dy-card-body',
  template: `<ng-content></ng-content>`,
})
export class DyCardBodyComponent {
}

/**
 * Component intended to be used within  the `<dy-card>` component.
 * Adds styles for a preset footer section.
 */
@Component({
  selector: 'dy-card-footer',
  template: `<ng-content></ng-content>`,
})
export class DyCardFooterComponent {
}

/**
 * Basic content container component.
 *
 * Basic card example:
 * @stacked-example(Showcase, card/card-showcase.component)
 *
 * Basic card configuration:
 *
 * ```html
 * <dy-card>
 *   <dy-card-body>
 *     Card
 *   </dy-card-body>
 * </dy-card>
 * ```
 *
 * ### Installation
 *
 * Import `DyCardModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyCardModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Card with header and footer:
 * @stacked-example(With Header & Footer, card/card-full.component)
 *
 * Most of the time main card content goes to `dy-card-body`,
 * so it is styled and aligned in accordance with the header and footer.
 * In case you need a higher level of control, you can pass contend directly to `dy-card`,
 * so `dy-card-body` styling will not be applied.
 *
 * Consider an example with `dy-list` component:
 * @stacked-example(Card with list, card/card-without-body.component)
 *
 * Colored cards could be simply configured by providing a `status` property:
 * @stacked-example(Colored Card, card/card-colors.component)
 *
 * It is also possible to assign an `accent` property for a slight card highlight
 * as well as combine it with `status`:
 * @stacked-example(Accent Card, card/card-accents.component)
 *
 * Cards of smaller sizes could be combined and put on the same row with a bigger card so they have the same heights.
 * @stacked-example(Card sizes combinations, card/card-sizes-combinations.component)
 *
 * @additional-example(Multiple Sizes, card/card-sizes.component)
 *
 * @styles
 *
 * card-background-color:
 * card-text-color:
 * card-text-font-family:
 * card-text-font-size:
 * card-text-font-weight:
 * card-text-line-height:
 * card-border-width:
 * card-border-style:
 * card-border-color:
 * card-border-radius:
 * card-padding:
 * card-shadow:
 * card-divider-color:
 * card-divider-style:
 * card-divider-width:
 * card-height-tiny:
 * card-height-small:
 * card-height-medium:
 * card-height-large:
 * card-height-giant:
 * card-margin-bottom:
 * card-scrollbar-color:
 * card-scrollbar-background-color:
 * card-scrollbar-width:
 */
@Component({
  selector: 'dy-card',
  styleUrls: ['./card.component.scss'],
  template: `
    <ng-content select="dy-card-header"></ng-content>
    <ng-content select="dy-card-body"></ng-content>
    <ng-content></ng-content>
    <ng-content select="dy-card-footer"></ng-content>
  `,
})
export class DyCardComponent {

  /**
   * Card size, available sizes:
   * tiny, small, medium, large, giant
   */
  @Input()
  get size(): '' | DyComponentSize {
    return this._size;
  }
  set size(value: '' | DyComponentSize) {
    this._size = value;
  }
  _size: '' | DyComponentSize = '';

  /**
   * Card status:
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`
   */
  @Input()
  status: '' | DyComponentOrCustomStatus = '';

  /**
   * Card accent (color of the top border):
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`
   */
  @Input()
  accent: '' | DyComponentStatus = '';

  @HostBinding('class.size-tiny')
  get tiny() {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small')
  get small() {
    return this.size === 'small';
  }

  @HostBinding('class.size-medium')
  get medium() {
    return this.size === 'medium';
  }

  @HostBinding('class.size-large')
  get large() {
    return this.size === 'large';
  }

  @HostBinding('class.size-giant')
  get giant() {
    return this.size === 'giant';
  }

  @HostBinding('class.status-primary')
  get primary() {
    return this.status === 'primary';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
  }

  @HostBinding('class.status-success')
  get success() {
    return this.status === 'success';
  }

  @HostBinding('class.status-warning')
  get warning() {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger() {
    return this.status === 'danger';
  }

  @HostBinding('class.status-basic')
  get basic() {
    return this.status === 'basic';
  }

  @HostBinding('class.status-control')
  get control() {
    return this.status === 'control';
  }

  @HostBinding('class.accent')
  get hasAccent() {
    return this.accent;
  }

  @HostBinding('class.accent-primary')
  get primaryAccent() {
    return this.accent === 'primary';
  }

  @HostBinding('class.accent-info')
  get infoAccent() {
    return this.accent === 'info';
  }

  @HostBinding('class.accent-success')
  get successAccent() {
    return this.accent === 'success';
  }

  @HostBinding('class.accent-warning')
  get warningAccent() {
    return this.accent === 'warning';
  }

  @HostBinding('class.accent-danger')
  get dangerAccent() {
    return this.accent === 'danger';
  }

  @HostBinding('class.accent-basic')
  get basicAccent() {
    return this.accent === 'basic';
  }

  @HostBinding('class.accent-control')
  get controlAccent() {
    return this.accent === 'control';
  }

  @HostBinding('class')
  get additionalClasses(): string[] {
    if (this.statusService.isCustomStatus(this.status)) {
      return [this.statusService.getStatusClass(this.status)];
    }
    return [];
  }

  constructor(protected statusService: DyStatusService) {
  }
}
