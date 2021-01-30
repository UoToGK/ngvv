import {
  Directive,
  Injectable,
  ModuleWithProviders,
  NgModule,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  CdkPortal,
  CdkPortalOutlet,
  ComponentPortal,
  Portal,
  PortalInjector,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ComponentType,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayModule,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { DyScrollStrategyOptions } from '../adapter/block-scroll-strategy-adapter';


@Directive({ selector: '[dyPortal]' })
export class DyPortalDirective extends CdkPortal {
}

@Directive({ selector: '[dyPortalOutlet]' })
export class DyPortalOutletDirective extends CdkPortalOutlet {
}

export class DyComponentPortal<T = any> extends ComponentPortal<T> {
}

@Injectable()
export class DyOverlay extends Overlay {
  scrollStrategies: DyScrollStrategyOptions;
}

@Injectable()
export class DyOverlayPositionBuilder extends OverlayPositionBuilder {
}

export class DyTemplatePortal<T = any> extends TemplatePortal<T> {
  constructor(template: TemplateRef<T>, viewContainerRef?: ViewContainerRef, context?: T) {
    super(template, viewContainerRef, context);
  }
}

@Injectable()
export class DyOverlayContainer extends OverlayContainer {
}

export class DyFlexibleConnectedPositionStrategy extends FlexibleConnectedPositionStrategy {
}

export class DyPortalInjector extends PortalInjector {
}

export type DyPortal<T = any> = Portal<T>;
export type DyOverlayRef = OverlayRef;
export type DyComponentType<T = any> = ComponentType<T>;
export type DyPositionStrategy = PositionStrategy;
export type DyConnectedPosition = ConnectedPosition;
export type DyConnectedOverlayPositionChange = ConnectedOverlayPositionChange;
export type DyConnectionPositionPair = ConnectionPositionPair;
export type DyOverlayConfig = OverlayConfig;
export type DyScrollStrategy = ScrollStrategy;

const CDK_MODULES = [OverlayModule, PortalModule];

/**
 * This module helps us to keep all angular/cdk deps inside our cdk module via providing aliases.
 * Approach will help us move cdk in separate npm package and refactor nebular/theme code.
 * */
@NgModule({
  imports: [...CDK_MODULES],
  exports: [
    ...CDK_MODULES,
    DyPortalDirective,
    DyPortalOutletDirective,
  ],
  declarations: [DyPortalDirective, DyPortalOutletDirective],
})
export class DyCdkMappingModule {
  static forRoot(): ModuleWithProviders<DyCdkMappingModule> {
    return {
      ngModule: DyCdkMappingModule,
      providers: [
        DyOverlay,
        DyOverlayPositionBuilder,
      ],
    };
  }
}
