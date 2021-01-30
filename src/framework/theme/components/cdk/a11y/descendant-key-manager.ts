import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { QueryList } from '@angular/core';

export type DyHighlightableOption = Highlightable;
export class DyActiveDescendantKeyManager<T> extends ActiveDescendantKeyManager<T> {}

export class DyActiveDescendantKeyManagerFactoryService<T extends DyHighlightableOption> {
  create(items: QueryList<T> | T[]): DyActiveDescendantKeyManager<T> {
    return new DyActiveDescendantKeyManager<T>(items);
  }
}

export enum DyKeyManagerActiveItemMode {
  RESET_ACTIVE = -1,
  FIRST_ACTIVE = 0,
}
