import { ElementRef, Inject, Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DY_DOCUMENT } from '../../../theme.options';
import {
  DyConnectedOverlayPositionChange,
  DyConnectedPosition,
  DyConnectionPositionPair,
  DyFlexibleConnectedPositionStrategy,
  DyOverlayPositionBuilder,
  DyOverlayRef,
  DyPositionStrategy,
} from './mapping';
import { DyPlatform } from '../platform/platform-service';
import { DyOverlayContainerAdapter } from '../adapter/overlay-container-adapter';
import { DyViewportRulerAdapter } from '../adapter/viewport-ruler-adapter';
import { DyGlobalLogicalPosition } from './position-helper';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';


export type DyAdjustmentValues = 'noop' | 'clockwise' | 'counterclockwise' | 'vertical' | 'horizontal';
export enum DyAdjustment {
  NOOP = 'noop',
  CLOCKWISE = 'clockwise',
  COUNTERCLOCKWISE = 'counterclockwise',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

// tslint:disable-next-line:max-line-length
export type DyPositionValues = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end' | 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' | 'end-top' | 'end-bottom' | 'start-top' | 'start-bottom';
export enum DyPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  START = 'start',
  END = 'end',
  TOP_END = 'top-end',
  TOP_START = 'top-start',
  BOTTOM_END = 'bottom-end',
  BOTTOM_START = 'bottom-start',
  END_TOP = 'end-top',
  END_BOTTOM = 'end-bottom',
  START_TOP = 'start-top',
  START_BOTTOM = 'start-bottom',
}

const POSITIONS = {
  [DyPosition.RIGHT](offset) {
    return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset };
  },
  [DyPosition.BOTTOM](offset) {
    return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset };
  },
  [DyPosition.LEFT](offset) {
    return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset };
  },
  [DyPosition.TOP](offset) {
    return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset };
  },
  [DyPosition.START](offset) {
    return this[DyPosition.LEFT](offset);
  },
  [DyPosition.END](offset) {
    return this[DyPosition.RIGHT](offset);
  },
  [DyPosition.END_TOP](offset) {
    return { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: offset };
  },
  [DyPosition.END_BOTTOM](offset) {
    return { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: offset };
  },
  [DyPosition.BOTTOM_START](offset) {
    return { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: offset };
  },
  [DyPosition.BOTTOM_END](offset) {
    return { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: offset };
  },
  [DyPosition.START_TOP](offset) {
    return { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -offset };
  },
  [DyPosition.START_BOTTOM](offset) {
    return { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -offset };
  },
  [DyPosition.TOP_START](offset) {
    return { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -offset };
  },
  [DyPosition.TOP_END](offset) {
    return { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -offset };
  },
};

const COUNTER_CLOCKWISE_POSITIONS = [
  DyPosition.TOP,
  DyPosition.TOP_END,
  DyPosition.TOP_START,
  DyPosition.START,
  DyPosition.START_TOP,
  DyPosition.START_BOTTOM,
  DyPosition.BOTTOM,
  DyPosition.BOTTOM_START,
  DyPosition.BOTTOM_END,
  DyPosition.END,
  DyPosition.END_BOTTOM,
  DyPosition.END_TOP,
];
const CLOCKWISE_POSITIONS = [
  DyPosition.TOP,
  DyPosition.TOP_START,
  DyPosition.TOP_END,
  DyPosition.END,
  DyPosition.END_TOP,
  DyPosition.END_BOTTOM,
  DyPosition.BOTTOM,
  DyPosition.BOTTOM_END,
  DyPosition.BOTTOM_START,
  DyPosition.START,
  DyPosition.START_BOTTOM,
  DyPosition.START_TOP,
];
const VERTICAL_POSITIONS = [DyPosition.BOTTOM, DyPosition.TOP];
const HORIZONTAL_POSITIONS = [DyPosition.START, DyPosition.END];


function comparePositions(p1: DyConnectedPosition, p2: DyConnectedPosition): boolean {
  return p1.originX === p2.originX
    && p1.originY === p2.originY
    && p1.overlayX === p2.overlayX
    && p1.overlayY === p2.overlayY;
}

/**
 * The main idea of the adjustable connected strategy is to provide predefined set of positions for your overlay.
 * You have to provide adjustment and appropriate strategy will be chosen in runtime.
 * */
export class DyAdjustableConnectedPositionStrategy
  extends DyFlexibleConnectedPositionStrategy implements DyPositionStrategy {

  protected _position: DyPosition;
  protected _offset: number = 15;
  protected _adjustment: DyAdjustment;

  protected appliedPositions: { key: DyPosition, connectedPosition: DyConnectedPosition }[];

  readonly positionChange: Observable<DyPosition> = this.positionChanges.pipe(
    map((positionChange: DyConnectedOverlayPositionChange) => positionChange.connectionPair),
    map((connectionPair: DyConnectionPositionPair) => {
      return this.appliedPositions.find(({ connectedPosition }) => {
        return comparePositions(connectedPosition, connectionPair);
      }).key;
    }),
  );

  attach(overlayRef: DyOverlayRef) {
    /**
     * We have to apply positions before attach because super.attach() validates positions and crashes app
     * if no positions provided.
     * */
    this.applyPositions();
    super.attach(overlayRef);
  }

  apply() {
    this.applyPositions();
    super.apply();
  }

  position(position: DyPosition): this {
    this._position = position;
    return this;
  }

  adjustment(adjustment: DyAdjustment): this {
    this._adjustment = adjustment;
    return this;
  }

  offset(offset: number): this {
    this._offset = offset;
    return this;
  }

  protected applyPositions() {
    const positions: DyPosition[] = this.createPositions();
    this.persistChosenPositions(positions);
    this.withPositions(this.appliedPositions.map(({ connectedPosition }) => connectedPosition));
  }

  protected createPositions(): DyPosition[] {
    switch (this._adjustment) {
      case DyAdjustment.NOOP:
        return [ this._position ];
      case DyAdjustment.CLOCKWISE:
        return this.reorderPreferredPositions(CLOCKWISE_POSITIONS);
      case DyAdjustment.COUNTERCLOCKWISE:
        return this.reorderPreferredPositions(COUNTER_CLOCKWISE_POSITIONS);
      case DyAdjustment.HORIZONTAL:
        return this.reorderPreferredPositions(HORIZONTAL_POSITIONS);
      case DyAdjustment.VERTICAL:
        return this.reorderPreferredPositions(VERTICAL_POSITIONS);
    }
  }

  protected persistChosenPositions(positions: DyPosition[]) {
    this.appliedPositions = positions.map(position => ({
      key: position,
      connectedPosition: POSITIONS[position](this._offset),
    }));
  }

  protected reorderPreferredPositions(positions: DyPosition[]): DyPosition[] {
    // Physical positions should be mapped to logical as adjustments use logical positions.
    const startPositionIndex = positions.indexOf(this.mapToLogicalPosition(this._position));
    const firstPart = positions.slice(startPositionIndex);
    const secondPart = positions.slice(0, startPositionIndex);
    return firstPart.concat(secondPart);
  }

  protected mapToLogicalPosition(position: DyPosition): DyPosition {
    if (position === DyPosition.LEFT) {
      return DyPosition.START;
    }
    if (position === DyPosition.RIGHT) {
      return DyPosition.END;
    }

    return position;
  }
}

export class DyGlobalPositionStrategy extends GlobalPositionStrategy {

  position(position: DyGlobalLogicalPosition): this {
    switch (position) {
      case DyGlobalLogicalPosition.TOP_START:
        return this.top().left();

      case DyGlobalLogicalPosition.TOP_END:
        return this.top().right();

      case DyGlobalLogicalPosition.BOTTOM_START:
        return this.bottom().left();

      case DyGlobalLogicalPosition.BOTTOM_END:
        return this.bottom().right();
    }
  }
}

@Injectable()
export class DyPositionBuilderService {
  constructor(@Inject(DY_DOCUMENT) protected document,
              protected viewportRuler: DyViewportRulerAdapter,
              protected platform: DyPlatform,
              protected positionBuilder: DyOverlayPositionBuilder,
              protected overlayContainer: DyOverlayContainerAdapter) {
  }

  global(): DyGlobalPositionStrategy {
    return new DyGlobalPositionStrategy();
  }

  connectedTo(elementRef: ElementRef): DyAdjustableConnectedPositionStrategy {
    return new DyAdjustableConnectedPositionStrategy(
      elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer,
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
