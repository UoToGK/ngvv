import { DyIcon } from './icon';

export interface DyIcons {
  [key: string]: DyIcon | string;
}

export enum DyIconPackType  {
  SVG = 'svg',
  FONT = 'font',
}

export interface DyIconPackParams {
  packClass?: string,
  [name: string]: any,
}

export interface DyFontIconPackParams extends DyIconPackParams {
  iconClassPrefix?: string,
}

export interface DyIconPack {
  name: string;
  type: DyIconPackType;
  icons: Map<string, DyIcon | string>;
  params: DyIconPackParams,
}
