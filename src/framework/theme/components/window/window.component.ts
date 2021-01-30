import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  Renderer2,
  ViewChild,
  Type,
  ComponentFactoryResolver,
  Input,
  AfterViewChecked,
} from '@angular/core';
import { DyFocusTrap, DyFocusTrapFactoryService } from '../cdk/a11y/focus-trap';
import { DyComponentPortal, DyComponentType, DyTemplatePortal } from '../cdk/overlay/mapping';
import { DyOverlayContainerComponent } from '../cdk/overlay/overlay-container';
import { DY_WINDOW_CONTENT, DyWindowConfig, DyWindowState, DY_WINDOW_CONTEXT } from './window.options';
import { DyWindowRef } from './window-ref';

@Component({
  selector: 'dy-window',
  template: `
    <dy-card>
      <dy-card-header>
        <div cdkFocusInitial class="title" tabindex="-1">{{ config.title }}</div>

        <div class="buttons">
          <button dyButton ghost (click)="minimize()">
            <dy-icon icon="minus-outline" pack="nebular-essentials"></dy-icon>
          </button>
          <button dyButton ghost *ngIf="isFullScreen" (click)="maximize()">
            <dy-icon icon="collapse-outline" pack="nebular-essentials"></dy-icon>
          </button>
          <button dyButton ghost *ngIf="minimized || maximized" (click)="maximizeOrFullScreen()">
            <dy-icon icon="expand-outline" pack="nebular-essentials"></dy-icon>
          </button>
          <button dyButton ghost (click)="close()">
            <dy-icon icon="close-outline" pack="nebular-essentials"></dy-icon>
          </button>
        </div>
      </dy-card-header>
      <dy-card-body *ngIf="maximized || isFullScreen">
        <dy-overlay-container></dy-overlay-container>
      </dy-card-body>
    </dy-card>
  `,
  styleUrls: ['./window.component.scss'],
})
export class DyWindowComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() cfr: ComponentFactoryResolver;

  @HostBinding('class.full-screen')
  get isFullScreen() {
    return this.windowRef.state === DyWindowState.FULL_SCREEN;
  }

  @HostBinding('class.maximized')
  get maximized() {
    return this.windowRef.state === DyWindowState.MAXIMIZED;
  }

  @HostBinding('class.minimized')
  get minimized() {
    return this.windowRef.state === DyWindowState.MINIMIZED;
  }

  @ViewChild(DyOverlayContainerComponent) overlayContainer: DyOverlayContainerComponent;

  protected focusTrap: DyFocusTrap;

  constructor(
    @Inject(DY_WINDOW_CONTENT) public content: TemplateRef<any> | DyComponentType,
    @Inject(DY_WINDOW_CONTEXT) public context: Object,
    public windowRef: DyWindowRef,
    public config: DyWindowConfig,
    protected focusTrapFactory: DyFocusTrapFactoryService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    this.focusTrap.blurPreviouslyFocusedElement();
    this.focusTrap.focusInitialElement();

    if (this.config.windowClass) {
      this.renderer.addClass(this.elementRef.nativeElement, this.config.windowClass);
    }
  }

  ngAfterViewChecked() {
    if (!this.overlayContainer || this.overlayContainer.isAttached) {
      return;
    }

    if (this.content instanceof TemplateRef) {
      this.attachTemplate();
    } else {
      this.attachComponent();
    }
  }

  ngOnDestroy() {
    if (this.focusTrap) {
      this.focusTrap.restoreFocus();
    }

    this.close();
  }

  minimize() {
    if (this.windowRef.state === DyWindowState.MINIMIZED) {
      this.windowRef.toPreviousState();
    } else {
      this.windowRef.minimize();
    }
  }

  maximize() {
    this.windowRef.maximize();
  }

  fullScreen() {
    this.windowRef.fullScreen();
  }

  maximizeOrFullScreen() {
    if (this.windowRef.state === DyWindowState.MINIMIZED) {
      this.maximize();
    } else {
      this.fullScreen();
    }
  }

  close() {
    this.windowRef.close();
  }

  protected attachTemplate() {
    this.overlayContainer
      .attachTemplatePortal(new DyTemplatePortal(this.content as TemplateRef<any>, null, this.context));
  }

  protected attachComponent() {
    const portal = new DyComponentPortal(this.content as Type<any>, null, null, this.cfr);
    const ref = this.overlayContainer.attachComponentPortal(portal, this.context);
    ref.changeDetectorRef.detectChanges();
  }
}
