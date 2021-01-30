

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { from, merge, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { DyStatusService } from '../../services/status.service';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyComponentSize } from '../component-size';
import { DyComponentShape } from '../component-shape';
import { DyComponentOrCustomStatus } from '../component-status';
import { DyButton } from '../button/base-button';
import { DyButtonToggleAppearance, DyButtonToggleChange, DyButtonToggleDirective } from './button-toggle.directive';

/**
 * `<dy-button-group>` visually groups buttons together and allow to control buttons properties and the state as a
 * group.
 * @stacked-example(Button Group Showcase, button-group/button-group-showcase.component)
 *
 * ### Installation
 *
 * Import `DyButtonGroupModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyButtonGroupModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * You can use `<dy-button-group>` to group a series of `[dyButton]` or `[dyButtonToggle]` components.
 * @stacked-example(Button and Button Toggle Groups, button-group/button-and-button-toggle-groups.component)
 *
 * For a group of multiple `[dyButtonToggle]` you also can control multi-selection behavior. By default, the group
 * component allows only one pressed button toggle at a time (similar to the radio group). To be able to keep multiple
 * toggles pressed, you need to add `multiple` attributes to the `<dy-button-toggle>`.
 * @stacked-example(Button Group Multiple, button-group/button-group-multiple.component)
 *
 * To disable a group of buttons, add a `disabled` attribute to the `<dy-button-group>`.
 * @stacked-example(Button Group Disabled, button-group/button-group-disabled.component)
 *
 * The group component controls all visual attributes of buttons such as `appearance`, `status`, `size`, `shape`.
 * You can change it via the appropriate attributes.
 *
 * Button group appearances:
 * @stacked-example(Button Group Appearances, button-group/button-group-appearances.component)
 *
 * Button group statuses:
 * @stacked-example(Button Group Statuses, button-group/button-group-statuses.component)
 *
 * Button group sizes:
 * @stacked-example(Button Group Sizes, button-group/button-group-sizes.component)
 *
 * Buttons group shapes:
 * @additional-example(Button Group Shapes, button-group/button-group-shapes.component)
 *
 * @styles
 *
 * button-group-filled-button-basic-text-color:
 * button-group-filled-button-primary-text-color:
 * button-group-filled-button-success-text-color:
 * button-group-filled-button-info-text-color:
 * button-group-filled-button-warning-text-color:
 * button-group-filled-button-danger-text-color:
 * button-group-filled-button-control-text-color:
 * button-group-filled-basic-divider-color:
 * button-group-filled-primary-divider-color:
 * button-group-filled-success-divider-color:
 * button-group-filled-info-divider-color:
 * button-group-filled-warning-divider-color:
 * button-group-filled-danger-divider-color:
 * button-group-filled-control-divider-color:
 * button-group-ghost-divider-color:
 **/
@Component({
  selector: 'dy-button-group',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyButtonGroupComponent implements OnChanges, AfterContentInit {

  protected readonly destroy$: Subject<void> = new Subject<void>();
  protected readonly buttonsChange$ = new Subject<DyButton[]>();

  @ContentChildren(DyButton) readonly buttons: QueryList<DyButton>;

  /**
   * Button group size, available sizes:
   * `tiny`, `small`, `medium`, `large`, `giant`
   */
  @Input() size: DyComponentSize = 'medium';

  /**
   * Button group status (adds specific styles):
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`
   */
  @Input() status: DyComponentOrCustomStatus = 'basic';

  /**
   * Button group shapes: `rectangle`, `round`, `semi-round`
   */
  @Input() shape: DyComponentShape = 'rectangle';

  /**
   * Button group appearance: `filled`, `outline`, `ghost`
   */
  @Input() appearance: DyButtonToggleAppearance = 'filled';

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    if (this.disabled !== convertToBoolProperty(value)) {
      this._disabled = !this.disabled;
    }
  }
  protected _disabled = false;
  static ngAcceptInputType_disabled: DyBooleanInput;

  /**
   * Allows to keep multiple button toggles pressed. Off by default.
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = convertToBoolProperty(value);
  }
  protected _multiple: boolean = false;
  static ngAcceptInputType_multiple: DyBooleanInput;

  /**
   * Sets `filled` appearance
   */
  @Input()
  get filled(): boolean {
    return this.appearance === 'filled';
  }
  set filled(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'filled';
    }
  }
  static ngAcceptInputType_filled: DyBooleanInput;

  /**
   * Sets `outline` appearance
   */
  @Input()
  get outline(): boolean {
    return this.appearance === 'outline';
  }
  set outline(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'outline';
    }
  }
  static ngAcceptInputType_outline: DyBooleanInput;

  /**
   * Sets `ghost` appearance
   */
  @Input()
  get ghost(): boolean {
    return this.appearance === 'ghost';
  }
  set ghost(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'ghost';
    }
  }
  static ngAcceptInputType_ghost: DyBooleanInput;

  @HostBinding('attr.role') role = 'group';

  @HostBinding('class')
  get additionalClasses(): string[] {
    if (this.statusService.isCustomStatus(this.status)) {
      return [this.statusService.getStatusClass(this.status)];
    }
    return [];
  }

  constructor(
    protected cd: ChangeDetectorRef,
    protected statusService: DyStatusService,
  ) {}

  ngOnChanges({ size, status, shape, multiple, filled, outline, ghost, disabled }: SimpleChanges) {
    if (size || status || shape || multiple || filled || outline || ghost || disabled) {
      this.syncButtonsProperties(this.buttons?.toArray() || []);
    }
  }

  ngAfterContentInit(): void {
    this.buttonsChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((buttons: DyButton[]) => {
        this.listenButtonPressedState(buttons);
        this.syncButtonsProperties(buttons);
      });

    this.buttons.changes
      .pipe(
        // `buttons.changes` emit during change detection run after projected content already was initialized.
        // So at this time, it's too late to update projected buttons properties as updating bindings after
        // initialization doesn't make sense. Changes won't be picked up and should cause an "expression changed" error.
        // Instead, we wrap the new buttons list into a promise to defer update to the following microtask and also to
        // trigger change detection one more time.
        switchMap((buttons: QueryList<DyButton>) => from(Promise.resolve(buttons.toArray()))),
        takeUntil(this.destroy$),
      )
      .subscribe(this.buttonsChange$);

    this.buttonsChange$.next(this.buttons.toArray());
  }

  protected listenButtonPressedState(buttons: DyButton[]): void {
    const toggleButtons: DyButtonToggleDirective[] = buttons.filter((button: DyButton) => {
      return button instanceof DyButtonToggleDirective;
    }) as DyButtonToggleDirective[];

    if (!toggleButtons.length) {
      return;
    }

    const buttonsPressedChange$: Observable<DyButtonToggleChange>[] = toggleButtons
      .map((button: DyButtonToggleDirective) => button.pressedChange$);

    merge(...buttonsPressedChange$)
      .pipe(
        filter(({ pressed }: DyButtonToggleChange) => !this.multiple && pressed),
        takeUntil(merge(this.buttonsChange$, this.destroy$)),
      )
      .subscribe(({ source }: DyButtonToggleChange) => {
        toggleButtons
          .filter((button: DyButtonToggleDirective) => button !== source)
          .forEach((button: DyButtonToggleDirective) => button._updatePressed(false));
      });
  }

  protected syncButtonsProperties(buttons: DyButton[]): void {
    buttons.forEach((button: DyButton) => {
      button.updateProperties({
        appearance: this.appearance,
        size: this.size,
        status: this.status,
        shape: this.shape,
        disabled: this.disabled,
      });
    });
  }
}
