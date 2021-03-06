

import { Inject, Injectable } from '@angular/core';
import { DY_MEDIA_BREAKPOINTS } from '../theme.options';

/**
 * Media breakpoint type
 *
 * Where `name` - breakpoint name alias (e.g. xs, sm, md, etc), and width - min breakpoint width
 */
export interface DyMediaBreakpoint {
  name: string;
  width: number;
}

export const DEFAULT_MEDIA_BREAKPOINTS = [
  {
    name: 'xs',
    width: 0,
  },
  {
    name: 'is',
    width: 400,
  },
  {
    name: 'sm',
    width: 576,
  },
  {
    name: 'md',
    width: 768,
  },
  {
    name: 'lg',
    width: 992,
  },
  {
    name: 'xl',
    width: 1200,
  },
  {
    name: 'xxl',
    width: 1400,
  },
  {
    name: 'xxxl',
    width: 1600,
  },
];

/**
 * Manages media breakpoints
 *
 * Provides access to available media breakpoints to convert window width to a configured breakpoint,
 * e.g. 200px - *xs* breakpoint
 */
@Injectable()
export class DyMediaBreakpointsService {

  private breakpointsMap: { [breakpoint: string]: number };

  constructor(@Inject(DY_MEDIA_BREAKPOINTS) private breakpoints) {
    this.breakpointsMap = this.breakpoints.reduce((res, b: DyMediaBreakpoint) => {
      res[b.name] = b.width;
      return res;
    }, {});
  }

  /**
   * Returns a configured breakpoint by width
   * @param width number
   * @returns {Z|{name: string, width: number}}
   */
  getByWidth(width: number): DyMediaBreakpoint {
    const unknown = { name: 'unknown', width: width };
    const breakpoints = this.getBreakpoints();

    return breakpoints
      .find((point: DyMediaBreakpoint, index: number) => {
        const next = breakpoints[index + 1];
        return width >= point.width && (!next || width < next.width);
      }) || unknown;
  }

  /**
   * Returns a configured breakpoint by name
   * @param name string
   * @returns DyMediaBreakpoint
   */
  getByName(name: string): DyMediaBreakpoint {
    const unknown = { name: 'unknown', width: NaN };
    const breakpoints = this.getBreakpoints();

    return breakpoints.find((point: DyMediaBreakpoint) => name === point.name) || unknown;
  }

  /**
   * Returns a list of configured breakpoints for the theme
   * @returns DyMediaBreakpoint[]
   */
  getBreakpoints(): DyMediaBreakpoint[] {
    return this.breakpoints;
  }

  /**
   * Returns a map of configured breakpoints for the theme
   * @returns {[p: string]: number}
   */
  getBreakpointsMap(): { [breakpoint: string]: number } {
    return this.breakpointsMap;
  }
}
