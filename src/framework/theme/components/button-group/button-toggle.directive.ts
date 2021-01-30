

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  Output,
  Renderer2,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DyStatusService } from '../../services/status.service';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyButton, DyButtonAppearance } from '../button/base-button';

export type DyButtonToggleAppearance = Exclude<DyButtonAppearance, 'hero'>;

export interface DyButtonToggleChange {
  source: DyButtonToggleDirective;
  pressed: boolean;
}

/**
 * `[dyButtonToggle]` is a directive to add a `pressed` state to a button.
 */
@Directive({
  selector: 'button[dyButtonToggle]',
  providers: [
    { provide: DyButton, useExisting: DyButtonToggleDirective },
  ],
  exportAs: 'dyButtonToggle',
})
export class DyButtonToggleDirective extends DyButton {

  protected readonly _pressedChange$ = new Subject<DyButtonToggleChange>();

  get pressedChange$(): Observable<DyButtonToggleChange> {
    return this._pressedChange$.asObservable();
  }

  @Input() appearance: DyButtonToggleAppearance = 'filled';

  /**
   * Controls button pressed state
   **/
  @Input()
  @HostBinding('attr.aria-pressed')
  get pressed(): boolean {
    return this._pressed;
  }
  set pressed(value: boolean) {
    if (this.pressed !== convertToBoolProperty(value)) {
      this._pressed = !this.pressed;
      this.pressedChange.emit(this.pressed);
      this._pressedChange$.next({ source: this, pressed: this.pressed })
    }
  }
  protected _pressed: boolean = false;
  static ngAcceptInputType_pressed: DyBooleanInput;

  /**
   * Emits whenever button pressed state change
   **/
  @Output() readonly pressedChange = new EventEmitter<boolean>();

  @HostBinding('class.status-basic')
  get basic(): boolean {
    // By design, all toggle buttons should have a `basic` status when not pressed.
    return !this.pressed;
  }

  @HostBinding('class.status-primary')
  get primary(): boolean {
    return this.pressed && (this.status === 'basic' || this.status === 'primary');
  }

  @HostBinding('class.status-success')
  get success(): boolean {
    return this.pressed && this.status === 'success';
  }

  @HostBinding('class.status-info')
  get info(): boolean {
    return this.pressed && this.status === 'info';
  }

  @HostBinding('class.status-warning')
  get warning(): boolean {
    return this.pressed && this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger(): boolean {
    return this.pressed && this.status === 'danger';
  }

  @HostBinding('class.status-control')
  get control(): boolean {
    return this.pressed && this.status === 'control';
  }

  @HostBinding('class')
  get additionalClasses(): string[] {
    if (this.statusService.isCustomStatus(this.status)) {
      return [this.statusService.getStatusClass(this.status)];
    }
    return [];
  }

  @HostListener('click')
  onClick(): void {
    this.pressed = !this.pressed;
  }

  constructor(
    protected renderer: Renderer2,
    protected hostElement: ElementRef<HTMLElement>,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected statusService: DyStatusService,
  ) {
    super(renderer, hostElement, cd, zone, statusService);
  }

  /**
   * @docs-private
   */
  _updatePressed(value: boolean) {
    this.pressed = value;
    this.cd.markForCheck();
  }
}
