import { DyStepperComponent } from './stepper.component';
import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'button[dyStepperNext]',
})
export class DyStepperNextDirective {

  @Input() @HostBinding('attr.type') type: string = 'submit';

  constructor(protected stepper: DyStepperComponent) {
  }

  @HostListener('click')
  onClick() {
    this.stepper.next();
  }
}

@Directive({
  selector: 'button[dyStepperPrevious]',
})
export class DyStepperPreviousDirective {

  @Input() @HostBinding('attr.type') type: string = 'button';

  constructor(protected stepper: DyStepperComponent) {
  }

  @HostListener('click')
  onClick() {
    this.stepper.previous();
  }
}
