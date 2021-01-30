import { Component } from '@angular/core';

/**
 * Component intended to be used within the `<dy-flip-card>` and `<dy-reveal-card>` components.
 *
 * Use it as a container for the front card.
 */
@Component({
  selector: 'dy-card-front',
  template: '<ng-content select="dy-card"></ng-content>',
})
export class DyCardFrontComponent { }

/**
 * Component intended to be used within the `<dy-flip-card>` and `<dy-reveal-card>` components.
 *
 * Use it as a container for the back card.
 */
@Component({
  selector: 'dy-card-back',
  template: '<ng-content select="dy-card"></ng-content>',
})
export class DyCardBackComponent { }
