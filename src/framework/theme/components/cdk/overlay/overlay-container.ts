import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  HostBinding,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { DyPosition } from './overlay-position';
import { DyComponentPortal, DyPortalInjector, DyPortalOutletDirective, DyTemplatePortal } from './mapping';

export interface DyRenderableContainer {

  /**
   * A renderContent method renders content with provided context.
   * Naturally, this job has to be done by ngOnChanges lifecycle hook, but
   * ngOnChanges hook will be triggered only if we update content or context properties
   * through template property binding syntax. But in our case we're updating these properties programmatically.
   * */
  renderContent();
}

@Component({
  template: '',
})
export class DyPositionedContainerComponent {
  @Input() position: DyPosition;

  @HostBinding('class.dy-overlay-top')
  get top(): boolean {
    return this.position === DyPosition.TOP;
  }

  @HostBinding('class.dy-overlay-top-start')
  get topStart(): boolean {
    return this.position === DyPosition.TOP_START;
  }

  @HostBinding('class.dy-overlay-top-end')
  get topEnd(): boolean {
    return this.position === DyPosition.TOP_END;
  }

  @HostBinding('class.dy-overlay-right')
  get right(): boolean {
    return this.position === DyPosition.RIGHT || this.position === DyPosition.END;
  }

  @HostBinding('class.dy-overlay-end-top')
  get endTop(): boolean {
    return this.position === DyPosition.END_TOP;
  }

  @HostBinding('class.dy-overlay-end-bottom')
  get endBottom(): boolean {
    return this.position === DyPosition.END_BOTTOM;
  }

  @HostBinding('class.dy-overlay-bottom')
  get bottom(): boolean {
    return this.position === DyPosition.BOTTOM;
  }

  @HostBinding('class.dy-overlay-bottom-start')
  get bottomStart(): boolean {
    return this.position === DyPosition.BOTTOM_START;
  }

  @HostBinding('class.dy-overlay-bottom-end')
  get bottomEnd(): boolean {
    return this.position === DyPosition.BOTTOM_END;
  }

  @HostBinding('class.dy-overlay-left')
  get left(): boolean {
    return this.position === DyPosition.LEFT || this.position === DyPosition.START;
  }

  @HostBinding('class.dy-overlay-start-top')
  get startTop(): boolean {
    return this.position === DyPosition.START_TOP;
  }

  @HostBinding('class.dy-overlay-start-bottom')
  get startBottom(): boolean {
    return this.position === DyPosition.START_BOTTOM;
  }
}


@Component({
  selector: 'dy-overlay-container',
  template: `
    <div *ngIf="isStringContent" class="primitive-overlay">{{ content }}</div>
    <ng-template dyPortalOutlet></ng-template>
  `,
})
export class DyOverlayContainerComponent {

  // TODO static must be false as of Angular 9.0.0, issues/1514
  @ViewChild(DyPortalOutletDirective, { static: true }) portalOutlet: DyPortalOutletDirective;

  isAttached: boolean = false;

  content: string;

  constructor(protected vcr: ViewContainerRef,
              protected injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
  }

  get isStringContent(): boolean {
    return !!this.content;
  }

  attachComponentPortal<T>(portal: DyComponentPortal<T>, context?: Object): ComponentRef<T> {
    portal.injector = this.createChildInjector(portal.componentFactoryResolver);
    const componentRef = this.portalOutlet.attachComponentPortal(portal);
    if (context) {
      Object.assign(componentRef.instance, context);
    }
    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
    this.isAttached = true;
    return componentRef;
  }

  attachTemplatePortal<C>(portal: DyTemplatePortal<C>): EmbeddedViewRef<C> {
    const templateRef = this.portalOutlet.attachTemplatePortal(portal);
    templateRef.detectChanges();
    this.isAttached = true;
    return templateRef;
  }

  attachStringContent(content: string) {
    this.content = content;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    this.isAttached = true;
  }

  detach() {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
    this.attachStringContent(null);
    this.isAttached = false
  }

  protected createChildInjector(cfr: ComponentFactoryResolver): DyPortalInjector {
    return new DyPortalInjector(this.injector, new WeakMap([
      [ComponentFactoryResolver, cfr],
    ]));
  }
}
