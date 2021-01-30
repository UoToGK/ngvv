import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { DyStepperComponent } from './stepper.component';
import { DY_STEPPER } from './stepper-tokens';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';

/**
 * Component intended to be used within  the `<dy-stepper>` component.
 * Container for a step
 */
@Component({
  selector: 'dy-step',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class DyStepComponent {

  protected stepper: DyStepperComponent;

  // TODO static must be false as of Angular 9.0.0, issues/1514
  /**
   * Step content
   *
   * @type {TemplateRef}
   */
  @ViewChild(TemplateRef, { static: true }) content: TemplateRef<any>;

  /**
   * Top level abstract control of the step
   */
  @Input() stepControl?: { valid: boolean | null, reset: () => void };

  /**
   * Step label
   *
   * @type {string|TemplateRef<any>}
   */
  @Input() label: string|TemplateRef<any>;

  /**
   * Whether step will be displayed in wizard
   *
   * @type {boolean}
   */
  @Input()
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(value: boolean) {
    this._hidden = convertToBoolProperty(value);
  }
  protected _hidden = false;
  static ngAcceptInputType_hidden: DyBooleanInput;

  /**
   * Check that label is a TemplateRef.
   *
   * @return boolean
   * */
  get isLabelTemplate(): boolean {
    return this.label instanceof TemplateRef;
  }

  /**
   * Whether step is marked as completed.
   *
   * @type {boolean}
   */
  @Input()
  get completed(): boolean {
    return this._completed || this.isCompleted;
  }
  set completed(value: boolean) {
    this._completed = convertToBoolProperty(value);
  }
  protected _completed: boolean = false;
  static ngAcceptInputType_completed: DyBooleanInput;

  protected get isCompleted() {
    return this.stepControl ? this.stepControl.valid && this.interacted : this.interacted;
  }

  interacted = false;

  constructor(@Inject(DY_STEPPER) stepper) {
    this.stepper = stepper;
  }

  /**
   * Mark step as selected
   * */
  select(): void {
    this.stepper.selected = this;
  }

  /**
   * Reset step and stepControl state
   * */
  reset(): void {
    this.interacted = false;
    if (this.stepControl) {
      this.stepControl.reset();
    }
  }
}
