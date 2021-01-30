import { Component, Input, HostBinding } from '@angular/core';

/**
 * List is a container component that wraps `dy-list-item` component.
 *
 * Basic example:
 * @stacked-example(Simple list, list/simple-list-showcase.component)
 *
 * `dy-list-item` accepts arbitrary content, so you can create a list of any components.
 *
 * ### Installation
 *
 * Import `DyListModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyListModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * List of users:
 * @stacked-example(Users list, list/users-list-showcase.component)
 *
 * @styles
 *
 * list-item-divider-color:
 * list-item-divider-style:
 * list-item-divider-width:
 * list-item-padding:
 * list-item-text-color:
 * list-item-font-family:
 * list-item-font-size:
 * list-item-font-weight:
 * list-item-line-height:
 */
@Component({
  selector: 'dy-list',
  template: `<ng-content select="dy-list-item"></ng-content>`,
  styleUrls: [ './list.component.scss' ],
})
export class DyListComponent {
  /**
   * Role attribute value
   *
   * @type {string}
   */
  @Input()
  @HostBinding('attr.role')
  role = 'list';
}

/**
 * List item component is a grouping component that accepts arbitrary content.
 * It should be direct child of `dy-list` componet.
 */
@Component({
  selector: 'dy-list-item',
  template: `<ng-content></ng-content>`,
  styleUrls: [ 'list-item.component.scss' ],
})
export class DyListItemComponent {
  /**
   * Role attribute value
   *
   * @type {string}
   */
  @Input()
  @HostBinding('attr.role')
  role = 'listitem';
}
