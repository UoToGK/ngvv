import { ChangeDetectionStrategy, Component, Input, HostBinding } from '@angular/core';

import { DyComponentSize } from '../component-size';
import { DyPosition } from '../cdk/overlay/overlay-position';

/**
 * The `DyOptionListComponent` is container component for `DyOptionGroupComponent` and`DyOptionComponent` list.
 *
 * @styles
 *
 * option-list-max-height:
 * option-list-shadow:
 * option-list-background-color:
 * option-list-border-style:
 * option-list-border-width:
 * option-list-border-color:
 * option-list-border-radius:
 * option-list-adjacent-border-color:
 * option-list-adjacent-border-style:
 * option-list-adjacent-border-width:
 * */
@Component({
  selector: 'dy-option-list',
  template: `
    <ul class="option-list">
      <ng-content></ng-content>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyOptionListComponent<T> {

  @Input() size: DyComponentSize = 'medium';

  @Input() position: DyPosition;

  @HostBinding('class.position-top')
  get positionTop(): boolean {
    return this.position === DyPosition.TOP;
  }

  @HostBinding('class.position-bottom')
  get positionBottom(): boolean {
    return this.position === DyPosition.BOTTOM;
  }

  @HostBinding('class.size-tiny')
  get sizeTiny(): boolean {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small')
  get sizeSmall(): boolean {
    return this.size === 'small';
  }

  @HostBinding('class.size-medium')
  get sizeMedium(): boolean {
    return this.size === 'medium';
  }

  @HostBinding('class.size-large')
  get sizeLarge(): boolean {
    return this.size === 'large';
  }

  @HostBinding('class.size-giant')
  get sizeGiant(): boolean {
    return this.size === 'giant';
  }
}
