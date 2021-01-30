import { DyFontIconPackParams, DyIconPackParams } from './icon-pack';

export interface DyIconOptions {
  [name: string]: any;
}

export interface DyIcon {
  getClasses(options?: DyIconOptions): string[];
  getContent(options?: DyIconOptions): string;
}

export class DyFontIcon implements DyIcon {

  constructor(protected name, protected content: any, protected params: DyFontIconPackParams = {}) {}

  getClasses(options?: DyIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }

    const name = this.params.iconClassPrefix ? `${this.params.iconClassPrefix}-${this.name}` : this.name;
    classes.push(name);
    return classes;
  }

  getContent(options?: DyIconOptions): string {
    return this.content;
  }
}

export class DySvgIcon implements DyIcon {

  constructor(protected name, protected content: any, protected params: DyIconPackParams = {}) {}

  getClasses(options?: DyIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }
    return classes;
  }

  getContent(options?: DyIconOptions): string {
    return this.content;
  }
}
