

import { Component, Input } from '@angular/core';

import { DyMenuItem } from '../../components/menu/menu.service';
import { DyPositionedContainerComponent, DyRenderableContainer } from '../cdk/overlay/overlay-container';

/**
 * Context menu component used as content within DyContextMenuDirective.
 *
 * @styles
 *
 * context-menu-background-color:
 * context-menu-border-color:
 * context-menu-border-style:
 * context-menu-border-width:
 * context-menu-border-radius:
 * context-menu-text-align:
 * context-menu-min-width:
 * context-menu-max-width:
 * context-menu-shadow:
 * */
@Component({
  selector: 'dy-context-menu',
  template: `
    <dy-menu class="context-menu" [items]="context.items" [tag]="context.tag"></dy-menu>
  `,
})
export class DyContextMenuComponent extends DyPositionedContainerComponent implements DyRenderableContainer {

  @Input() items: DyMenuItem[] = [];
  @Input() tag: string;

  @Input()
  context: { items: DyMenuItem[], tag?: string } = { items: [] };


  /**
   * The method is empty since we don't need to do anything additionally
   * render is handled by change detection
   */
  renderContent() {}
}
