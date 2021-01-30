import { QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

export type DyFocusableOption = FocusableOption;
export class DyFocusKeyManager<T> extends FocusKeyManager<T> {}

export class DyFocusKeyManagerFactoryService<T extends DyFocusableOption> {
  create(items: QueryList<T> | T[]): DyFocusKeyManager<T> {
    return new DyFocusKeyManager<T>(items);
  }
}
