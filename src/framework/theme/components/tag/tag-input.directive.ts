

import {
  AfterViewInit,
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
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { DyStatusService } from '../../services/status.service';
import { DyFocusMonitor } from '../cdk/a11y/a11y.module';
import { ENTER } from '../cdk/keycodes/keycodes';
import { DyFormFieldControl } from '../form-field/form-field-control';
import { DyInputDirective } from '../input/input.directive';

export interface DyTagInputAddEvent {
  input: ElementRef<HTMLInputElement>;
  value: string;
}

/**
 *
 * `[dyTagInput]` directive connects input with a `dy-tag-list` component.
 *
 * @stacked-example(Tag Input, tag/tag-input.component)
 *
 * @additional-example(Tag Input with Autocomplete, tag/tag-input-with-autocomplete.component)
 *
 * @styles
 *
 * tag-list-tiny-tag-offset:
 * tag-list-small-tag-offset:
 * tag-list-medium-tag-offset:
 * tag-list-large-tag-offset:
 * tag-list-giant-tag-offset:
 * tag-list-with-input-tiny-padding:
 * tag-list-with-input-small-padding:
 * tag-list-with-input-medium-padding:
 * tag-list-with-input-large-padding:
 * tag-list-with-input-giant-padding:
 */
@Directive({
  selector: 'input[dyTagInput]',
  exportAs: 'dyTagInput',
  providers: [
    { provide: DyFormFieldControl, useExisting: DyTagInputDirective },
  ],
})
export class DyTagInputDirective extends DyInputDirective implements AfterViewInit {

  protected readonly keyDown$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();

  get _value(): string {
    return this._hostElement.nativeElement.value;
  }

  /**
   * Controls which keys should trigger tag add event.
   */
  @Input() separatorKeys: number[] = [ENTER];

  /**
   * Emits when a tag need to be added.
   */
  @Output() tagAdd: EventEmitter<DyTagInputAddEvent> = new EventEmitter<DyTagInputAddEvent>();

  @HostBinding('class.dy-tag-input') readonly dyTagInputClass = true;

  @HostListener('keydown', ['$event'])
  _onKeydown(event: KeyboardEvent): void {
    this.keyDown$.next(event);
  }

  constructor(
    public _hostElement: ElementRef<HTMLInputElement>,
    protected focusMonitor: DyFocusMonitor,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected statusService: DyStatusService,
  ) {
    super(_hostElement, focusMonitor, renderer, zone, statusService);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.keyDown$
      .pipe(
        filter(({ keyCode }: KeyboardEvent) => this.isSeparatorKey(keyCode)),
        map(() => this._value),
        takeUntil(this.destroy$),
      )
      .subscribe((value: string) => this.tagAdd.emit({ value, input: this._hostElement }));
  }

  protected isSeparatorKey(keyCode: number): boolean {
    return this.separatorKeys.includes(keyCode);
  }
}
