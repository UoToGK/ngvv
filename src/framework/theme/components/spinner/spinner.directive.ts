

import {
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
  HostBinding,
} from '@angular/core';

import { DyComponentSize } from '../component-size';
import { DyComponentOrCustomStatus } from '../component-status';
import { DySpinnerComponent } from './spinner.component';

/**
 * Styled spinner directive
 *
 * @stacked-example(Spinner Showcase, spinner/spinner-card.component)
 *
 *
 * ```ts
 * <dy-card [dySpinner]="loading" dySpinnerStatus="danger">
 *   <dy-card-body>Card Content</dy-card-body>
 * </dy-card>
 * ```
 *
 * ### Installation
 *
 * Import `DySpinnerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DySpinnerModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Could be colored using `status` property
 *
 * @stacked-example(Spinner Colors, spinner/spinner-colors.component)
 *
 * Available in different sizes with `size` property:
 *
 * @stacked-example(Spinner Sizes, spinner/spinner-sizes.component)
 *
 * It is also possible to place it into the button:
 * @stacked-example(Buttons with spinner, spinner/spinner-button.component)
 *
 * Or tabs:
 * @stacked-example(Spinner in tabs, spinner/spinner-tabs.component)
 */
@Directive({selector: '[dySpinner]'})
export class DySpinnerDirective implements OnInit {

  private shouldShow = false;
  spinner: ComponentRef<DySpinnerComponent>;
  componentFactory: ComponentFactory<DySpinnerComponent>;

  /**
   * Spinner message shown next to the icon
   * @type {string}
   */
  @Input('dySpinnerMessage') spinnerMessage: string;

  /**
   * Spinner status color
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`.
   */
  @Input('dySpinnerStatus') spinnerStatus: DyComponentOrCustomStatus = 'basic';

  /**
   * Spinner size. Possible values: `tiny`, `small`, `medium` (default), `large`, `giant`
   */
  @Input('dySpinnerSize') spinnerSize: DyComponentSize = 'medium';

  /**
   * Directive value - show or hide spinner
   * @param {boolean} val
   */
  @Input('dySpinner')
  set dySpinner(val: boolean) {
    if (this.componentFactory) {
      if (val) {
        this.show();
      } else {
        this.hide();
      }
    } else {
      this.shouldShow = val;
    }
  }

  @HostBinding('class.dy-spinner-container') isSpinnerExist = false;

  constructor(private directiveView: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private renderer: Renderer2,
              private directiveElement: ElementRef) {
  }

  ngOnInit() {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(DySpinnerComponent);
    if (this.shouldShow) {
      this.show();
    }
  }

  hide() {
    if (this.isSpinnerExist) {
      this.directiveView.remove();
      this.isSpinnerExist = false;
    }
  }

  show() {
    if (!this.isSpinnerExist) {
      this.spinner = this.directiveView.createComponent<DySpinnerComponent>(this.componentFactory);
      this.setInstanceInputs(this.spinner.instance);
      this.spinner.changeDetectorRef.detectChanges();
      this.renderer.appendChild(this.directiveElement.nativeElement, this.spinner.location.nativeElement);
      this.isSpinnerExist = true;
    }
  }

  setInstanceInputs(instance: DySpinnerComponent) {
    instance.message = this.spinnerMessage
    typeof this.spinnerStatus !== 'undefined' && (instance.status = this.spinnerStatus);
    typeof this.spinnerSize !== 'undefined' && (instance.size = this.spinnerSize);
  }
}
