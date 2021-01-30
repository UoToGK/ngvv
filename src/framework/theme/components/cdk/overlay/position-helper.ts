import { Injectable } from '@angular/core';

import { DyLayoutDirectionService } from '../../../services/direction.service';


export enum DyGlobalLogicalPosition {
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
}

export enum DyGlobalPhysicalPosition {
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
}

export type DyGlobalPosition = DyGlobalPhysicalPosition | DyGlobalLogicalPosition;

@Injectable()
export class DyPositionHelper {
  constructor(protected layoutDirection: DyLayoutDirectionService) {
  }

  toLogicalPosition(position: DyGlobalPosition): DyGlobalLogicalPosition {
    if (Object.values(DyGlobalLogicalPosition).includes(position as DyGlobalLogicalPosition)) {
      return position as DyGlobalLogicalPosition;
    }

    if (this.layoutDirection.isLtr()) {
      return this.toLogicalPositionWhenLtr(position as DyGlobalPhysicalPosition);
    } else {
      return this.toLogicalPositionWhenRtl(position as DyGlobalPhysicalPosition);
    }
  }

  toPhysicalPosition(position: DyGlobalPosition): DyGlobalPhysicalPosition {
    if (Object.values(DyGlobalPhysicalPosition).includes(position as DyGlobalPhysicalPosition)) {
      return position as DyGlobalPhysicalPosition;
    }

    if (this.layoutDirection.isLtr()) {
      return this.toPhysicalPositionWhenLtr(position as DyGlobalLogicalPosition);
    } else {
      return this.toPhysicalPositionWhenRtl(position as DyGlobalLogicalPosition);
    }
  }

  isTopPosition(position: DyGlobalPosition) {
    const logicalPosition = this.toLogicalPosition(position);

    return logicalPosition === DyGlobalLogicalPosition.TOP_END
      || logicalPosition === DyGlobalLogicalPosition.TOP_START;
  }

  isRightPosition(position: DyGlobalPosition) {
    const physicalPosition = this.toPhysicalPosition(position);

    return physicalPosition === DyGlobalPhysicalPosition.TOP_RIGHT
      || physicalPosition === DyGlobalPhysicalPosition.BOTTOM_RIGHT;
  }

  protected toLogicalPositionWhenLtr(position: DyGlobalPhysicalPosition): DyGlobalLogicalPosition {
    switch (position) {
      case DyGlobalPhysicalPosition.TOP_RIGHT:
        return DyGlobalLogicalPosition.TOP_END;
      case DyGlobalPhysicalPosition.TOP_LEFT:
        return DyGlobalLogicalPosition.TOP_START;
      case DyGlobalPhysicalPosition.BOTTOM_RIGHT:
        return DyGlobalLogicalPosition.BOTTOM_END;
      case DyGlobalPhysicalPosition.BOTTOM_LEFT:
        return DyGlobalLogicalPosition.BOTTOM_START;
    }
  }

  protected toLogicalPositionWhenRtl(position: DyGlobalPhysicalPosition): DyGlobalLogicalPosition {
    switch (position) {
      case DyGlobalPhysicalPosition.TOP_RIGHT:
        return DyGlobalLogicalPosition.TOP_START;
      case DyGlobalPhysicalPosition.TOP_LEFT:
        return DyGlobalLogicalPosition.TOP_END;
      case DyGlobalPhysicalPosition.BOTTOM_RIGHT:
        return DyGlobalLogicalPosition.BOTTOM_START;
      case DyGlobalPhysicalPosition.BOTTOM_LEFT:
        return DyGlobalLogicalPosition.BOTTOM_END;
    }
  }

  protected toPhysicalPositionWhenLtr(position: DyGlobalLogicalPosition): DyGlobalPhysicalPosition {
    switch (position) {
      case DyGlobalLogicalPosition.TOP_START:
        return DyGlobalPhysicalPosition.TOP_LEFT;
      case DyGlobalLogicalPosition.TOP_END:
        return DyGlobalPhysicalPosition.TOP_RIGHT;
      case DyGlobalLogicalPosition.BOTTOM_START:
        return DyGlobalPhysicalPosition.BOTTOM_LEFT;
      case DyGlobalLogicalPosition.BOTTOM_END:
        return DyGlobalPhysicalPosition.BOTTOM_RIGHT;
    }
  }

  protected toPhysicalPositionWhenRtl(position: DyGlobalLogicalPosition): DyGlobalPhysicalPosition {
    switch (position) {
      case DyGlobalLogicalPosition.TOP_START:
        return DyGlobalPhysicalPosition.TOP_RIGHT;
      case DyGlobalLogicalPosition.TOP_END:
        return DyGlobalPhysicalPosition.TOP_LEFT;
      case DyGlobalLogicalPosition.BOTTOM_START:
        return DyGlobalPhysicalPosition.BOTTOM_RIGHT;
      case DyGlobalLogicalPosition.BOTTOM_END:
        return DyGlobalPhysicalPosition.BOTTOM_LEFT;
    }
  }
}
