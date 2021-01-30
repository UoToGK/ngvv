import { Component, Input, HostBinding } from '@angular/core';

/**
 *
 * Flip card example:
 * @stacked-example(Showcase, flip-card/flip-card-showcase.component)
 *
 * As a content Flip card accepts two instances of `dy-card` - for front and back sides.
 *
 * Basic flip card configuration:
 *
 * ```html
 * <dy-flip-card>
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
 * </dy-flip-card>
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
 * Flip Card with header and footer:
 * @stacked-example(With Header & Footer, flip-card/flip-card-full.component.ts)
 *
 * Colored flip-cards could be simply configured by providing a `status` property:
 * @stacked-example(Colored Card, flip-card/flip-card-colors.component)
 *
 * It is also possible to assign an `accent` property for a slight card highlight
 * as well as combine it with `status`:
 * @stacked-example(Accent Card, flip-card/flip-card-accents.component)
 *
 * @additional-example(Multiple Sizes, flip-card/flip-card-sizes.component)
 *
 */
@Component({
  selector: 'dy-flip-card',
  styleUrls: ['./flip-card.component.scss'],
  template: `
    <div class="flipcard-body">
      <div class="front-container">
        <ng-content select="dy-card-front"></ng-content>
        <a *ngIf="showToggleButton" class="flip-button" (click)="toggle()">
          <dy-icon icon="chevron-left-outline" pack="nebular-essentials" aria-hidden="true"></dy-icon>
        </a>
      </div>
      <div class="back-container">
        <ng-content select="dy-card-back"></ng-content>
        <a *ngIf="showToggleButton" class="flip-button" (click)="toggle()">
          <dy-icon icon="chevron-left-outline" pack="nebular-essentials" aria-hidden="true"></dy-icon>
        </a>
      </div>
    </div>
  `,
})
export class DyFlipCardComponent {
  /**
   * Flip state
   * @type boolean
   */
  @Input()
  @HostBinding('class.flipped')
  flipped: boolean = false;

  /**
   * Show/hide toggle button to be able to control toggle from your code
   * @type {boolean}
   */
  @Input() showToggleButton = true;

  toggle() {
    this.flipped = !this.flipped;
  }
}
