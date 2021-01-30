import { Component, Input, HostBinding } from '@angular/core';

/**
 *
 * Reveal card example:
 * @stacked-example(My example, reveal-card/reveal-card-showcase.component)
 *
 * As a content Reveal card accepts two instances of `dy-card` - for front and back sides.
 *
 * Basic reveal card configuration:
 *
 * ```html
 * <dy-reveal-card>
 *   <dy-card-front>
 *     <dy-card>
 *       <dy-card-body>
 *         Front
 *       </dy-card-body>
 *     </dy-card>
 *   </dy-card-front>
 *   <dy-card-back>
 *     <dy-card>
 *       <dy-card-body>
 *         Back
 *       </dy-card-body>
 *     </dy-card>
 *   </dy-card-back>
 * </dy-reveal-card>
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
 * Reveal Card with header and footer:
 * @stacked-example(With Header & Footer, reveal-card/reveal-card-full.component)
 *
 * Colored reveal-cards could be simply configured by providing a `status` property:
 * @stacked-example(Colored Card, reveal-card/reveal-card-colors.component)
 *
 * It is also possible to assign an `accent` property for a slight card highlight
 * as well as combine it with `status`:
 * @stacked-example(Accent Card, reveal-card/reveal-card-accents.component)
 *
 * @additional-example(Multiple Sizes, reveal-card/reveal-card-sizes.component)
 */
@Component({
  selector: 'dy-reveal-card',
  styleUrls: ['./reveal-card.component.scss'],
  template: `
    <ng-content select="dy-card-front"></ng-content>
    <div class="second-card-container">
      <ng-content select="dy-card-back"></ng-content>
    </div>
    <a *ngIf="showToggleButton" class="reveal-button" (click)="toggle()">
      <dy-icon icon="chevron-down-outline" pack="nebular-essentials" aria-hidden="true"></dy-icon>
    </a>
  `,
})
export class DyRevealCardComponent {
  /**
   * Reveal state
   * @type boolean
   */
  @Input()
  @HostBinding('class.revealed')
  revealed: boolean = false;

  /**
   * Show/hide toggle button to be able to control toggle from your code
   * @type {boolean}
   */
  @Input() showToggleButton = true;

  toggle() {
    this.revealed = !this.revealed;
  }
}
