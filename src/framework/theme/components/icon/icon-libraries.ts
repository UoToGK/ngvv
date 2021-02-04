import { Injectable } from '@angular/core';
import { DyFontIconPackParams, DyIconPack, DyIconPackParams, DyIconPackType, DyIcons } from './icon-pack';
import { DyFontIcon, DyIcon, DySvgIcon } from './icon';

export class DyIconDefinition {
  name: string;
  type: string;
  pack: string;
  icon: DyIcon;
}

function throwPackNotFoundError(name: string) {
  throw Error(`Icon Pack '${name}' is not registered`);
}

function throwNoDefaultPackError() {
  throw Error('Default pack is not registered.');
}

function throwWrongPackTypeError(name: string, type: string, desiredType: string) {
  throw Error(`Pack '${name}' is not an '${desiredType}' Pack and its type is '${type}'`);
}

/**
 * This service allows to register multiple icon packs to use them later within `<dy-icon></dy-icon>` component.
 */
@Injectable({providedIn: 'root'})
export class DyIconLibraries {

  protected packs: Map<string, DyIconPack> = new Map();
  protected defaultPack: DyIconPack;

  /**
   * Registers new Svg icon pack
   * @param {string} name
   * @param {DyIcon} icons
   * @param {DyIconPackParams} params
   */
  registerSvgPack(name: string, icons: DyIcons, params: DyIconPackParams= {}) {
    this.packs.set(name, {
      name,
      icons: new Map(Object.entries(icons)),
      params,
      type: DyIconPackType.SVG,
    });
  }

  /**
   * Registers new font pack
   * @param {string} name
   * @param {DyIconPackParams} params
   */
  registerFontPack(name: string, params: DyFontIconPackParams = {}) {
    this.packs.set(name, {
      name,
      params,
      icons: new Map(),
      type: DyIconPackType.FONT,
    });
  }

  /**
   * Returns pack by name
   * @param {string} name
   */
  getPack(name: string): DyIconPack {
    return this.packs.get(name);
  }

  /**
   * Sets pack as a default
   * @param {string} name
   */
  setDefaultPack(name: string) {
    if (!this.packs.has(name)) {
      throwPackNotFoundError(name);
    }

    this.defaultPack = this.packs.get(name);
  }

  /**
   * Returns Svg icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns DyIconDefinition
   */
  getSvgIcon(name: string, pack?: string): DyIconDefinition | null {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== DyIconPackType.SVG) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'SVG');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    if (!icon) {
      return null;
    }

    return {
      name,
      pack: iconsPack.name,
      type: DyIconPackType.SVG,
      icon: this.createSvgIcon(name, icon, iconsPack.params),
    };
  }

  /**
   * Returns Font icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns DyIconDefinition
   */
  getFontIcon(name: string, pack?: string): DyIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== DyIconPackType.FONT) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'Font');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    return {
      name,
      pack: iconsPack.name,
      type: DyIconPackType.FONT,
      icon: this.createFontIcon(name, icon ? icon : '', iconsPack.params),
    };
  }

  /**
   * Returns an icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns DyIconDefinition
   */
  getIcon(name: string, pack?: string): DyIconDefinition | null {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type === DyIconPackType.SVG) {
      return this.getSvgIcon(name, pack);
    }

    return this.getFontIcon(name, pack);
  }

  protected createSvgIcon(name: string, content: DyIcon | string, params: DyIconPackParams): DySvgIcon {
    return content instanceof DySvgIcon ? content : new DySvgIcon(name, content, params);
  }

  protected createFontIcon(name: string, content: DyIcon | string, params: DyFontIconPackParams): DyFontIcon {
    return content instanceof DyFontIcon ? content : new DyFontIcon(name, content, params);
  }

  protected getPackOrThrow(name: string): DyIconPack {

    const pack: DyIconPack = this.packs.get(name);
    if (!pack) {
      throwPackNotFoundError(name);
    }
    return pack;
  }

  protected getDefaultPackOrThrow(): DyIconPack {

    if (!this.defaultPack) {
      throwNoDefaultPackError();
    }
    return this.defaultPack;
  }

  protected getIconFromPack(name: string, pack: DyIconPack): DyIcon | string | null {
    if (pack.icons.has(name)) {
      return pack.icons.get(name);
    }

    return null;
  }
}
