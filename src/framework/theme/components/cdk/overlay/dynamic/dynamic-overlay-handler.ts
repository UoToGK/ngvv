import { ElementRef, Injectable, SimpleChange, Type } from '@angular/core';

import { DyTrigger, DyTriggerStrategy, DyTriggerStrategyBuilderService } from '../overlay-trigger';
import {
  DyAdjustableConnectedPositionStrategy,
  DyAdjustment,
  DyPosition,
  DyPositionBuilderService,
} from '../overlay-position';
import { DyRenderableContainer } from '../overlay-container';
import { DyOverlayContent } from '../overlay-service';
import { DyDynamicOverlay } from './dynamic-overlay';
import { DyOverlayConfig } from '../mapping';

export class DyDynamicOverlayChange extends SimpleChange {

  constructor(previousValue: any, currentValue: any, firstChange: boolean = false) {
    super(previousValue, currentValue, firstChange);
  }

  isChanged(): boolean {
    return this.currentValue !== this.previousValue;
  }
}

@Injectable()
export class DyDynamicOverlayHandler {

  protected _componentType: Type<DyRenderableContainer>;
  protected _host: ElementRef;
  protected _context: Object = {};
  protected _content: DyOverlayContent;
  protected _trigger: DyTrigger = DyTrigger.NOOP;
  protected _position: DyPosition = DyPosition.TOP;
  protected _adjustment: DyAdjustment = DyAdjustment.NOOP;
  protected _offset: number = 15;
  protected _overlayConfig: DyOverlayConfig = {};

  protected dynamicOverlay: DyDynamicOverlay;
  protected triggerStrategy: DyTriggerStrategy;

  protected positionStrategy: DyAdjustableConnectedPositionStrategy;

  protected changes: { [key: string]: DyDynamicOverlayChange } = {};

  constructor(private positionBuilder: DyPositionBuilderService,
              private triggerStrategyBuilder: DyTriggerStrategyBuilderService,
              private dynamicOverlayService: DyDynamicOverlay) {
  }

  host(host: ElementRef) {
    this.changes.host = new DyDynamicOverlayChange(this._host, host);
    this._host = host;
    return this;
  }

  trigger(trigger: DyTrigger) {
    this.changes.trigger = new DyDynamicOverlayChange(this._trigger, trigger);
    this._trigger = trigger;
    return this;
  }

  position(position: DyPosition) {
    this.changes.position = new DyDynamicOverlayChange(this._position, position);
    this._position = position;
    return this;
  }

  adjustment(adjustment: DyAdjustment) {
    this.changes.adjustment = new DyDynamicOverlayChange(this._adjustment, adjustment);
    this._adjustment = adjustment;
    return this;
  }

  componentType(componentType: Type<DyRenderableContainer>) {
    this.changes.componentType = new DyDynamicOverlayChange(this._componentType, componentType);
    this._componentType = componentType;
    return this;
  }

  content(content: DyOverlayContent) {
    this.changes.content = new DyDynamicOverlayChange(this._content, content);
    this._content = content;
    return this;
  }

  context(context: {}) {
    this.changes.context = new DyDynamicOverlayChange(this._context, context);
    this._context = context;
    return this;
  }

  offset(offset: number) {
    this.changes.offset = new DyDynamicOverlayChange(this._offset, offset);
    this._offset = offset;
    return this;
  }

  overlayConfig(overlayConfig: DyOverlayConfig) {
    this.changes.overlayConfig = new DyDynamicOverlayChange(this._overlayConfig, overlayConfig);
    this._overlayConfig = overlayConfig;
    return this;
  }

  build() {
    if (!this._componentType || !this._host) {
      throw Error(`DyDynamicOverlayHandler: at least 'componentType' and 'host' should be
      passed before building a dynamic overlay.`)
    }
    this.dynamicOverlay = this.dynamicOverlayService.create(
      this._componentType,
      this._content,
      this._context,
      this.createPositionStrategy(),
      this._overlayConfig,
    );

    this.connect();
    this.clearChanges();

    return this.dynamicOverlay;
  }

  rebuild() {
    /**
     * we should not throw here
     * as we use rebuilt in lifecycle hooks
     * which it could be called before the build
     * so we just ignore this call
     */
    if (!this.dynamicOverlay) {
      return;
    }

    if (this.isPositionStrategyUpdateRequired()) {
      this.dynamicOverlay.setPositionStrategy(this.createPositionStrategy());
    }

    if (this.isTriggerStrategyUpdateRequired()) {
      this.connect();
    }

    if (this.isContainerRerenderRequired()) {
      this.dynamicOverlay.setContentAndContext(this._content, this._context);
    }

    if (this.isComponentTypeUpdateRequired()) {
      this.dynamicOverlay.setComponent(this._componentType);
    }

    if (this.isOverlayConfigUpdateRequired()) {
      this.dynamicOverlay.setOverlayConfig(this._overlayConfig);
    }

    this.clearChanges();
    return this.dynamicOverlay;
  }

  connect() {
    if (!this.dynamicOverlay) {
      throw new Error(`DyDynamicOverlayHandler: cannot connect to DynamicOverlay
      as it is not created yet. Call build() first`);
    }
    this.disconnect();
    this.subscribeOnTriggers(this.dynamicOverlay);
  }

  disconnect() {
    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
  }

  destroy() {
    this.disconnect();
    this.clearChanges();
    if (this.dynamicOverlay) {
      this.dynamicOverlay.dispose();
    }
  }

  protected createPositionStrategy() {
    return this.positionBuilder
      .connectedTo(this._host)
      .position(this._position)
      .adjustment(this._adjustment)
      .offset(this._offset);
  }

  protected subscribeOnTriggers(dynamicOverlay: DyDynamicOverlay) {
    this.triggerStrategy = this.triggerStrategyBuilder
      .trigger(this._trigger)
      .host(this._host.nativeElement)
      .container(() => dynamicOverlay.getContainer())
      .build();

    this.triggerStrategy.show$.subscribe(() => dynamicOverlay.show());
    this.triggerStrategy.hide$.subscribe(() => dynamicOverlay.hide());
  }

  protected isContainerRerenderRequired() {
    return this.isContentUpdated()
      || this.isContextUpdated()
      || this.isPositionStrategyUpdateRequired();
  }

  protected isPositionStrategyUpdateRequired(): boolean {
    return this.isAdjustmentUpdated() || this.isPositionUpdated() || this.isOffsetUpdated() || this.isHostUpdated();
  }

  protected isTriggerStrategyUpdateRequired(): boolean {
    return this.isTriggerUpdated() || this.isHostUpdated();
  }

  protected isComponentTypeUpdateRequired(): boolean {
    return this.isComponentTypeUpdated();
  }

  private isOverlayConfigUpdateRequired(): boolean {
    return this.isOverlayConfigUpdated();
  }

  protected isComponentTypeUpdated(): boolean {
    return this.changes.componentType && this.changes.componentType.isChanged();
  }

  protected isContentUpdated(): boolean {
    return this.changes.content && this.changes.content.isChanged();
  }

  protected isContextUpdated(): boolean {
    return this.changes.context && this.changes.context.isChanged();
  }

  protected isAdjustmentUpdated(): boolean {
    return this.changes.adjustment && this.changes.adjustment.isChanged();
  }

  protected isPositionUpdated(): boolean {
    return this.changes.position && this.changes.position.isChanged();
  }

  protected isHostUpdated(): boolean {
    return this.changes.host && this.changes.host.isChanged();
  }

  protected isTriggerUpdated(): boolean {
    return this.changes.trigger && this.changes.trigger.isChanged();
  }

  protected isOffsetUpdated(): boolean {
    return this.changes.offset && this.changes.offset.isChanged();
  }

  protected isOverlayConfigUpdated(): boolean {
    return this.changes.overlayConfig && this.changes.overlayConfig.isChanged();
  }

  protected clearChanges() {
    this.changes = {};
  }
}
