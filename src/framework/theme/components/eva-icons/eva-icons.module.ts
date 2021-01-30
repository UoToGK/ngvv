/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NgModule } from '@angular/core';
import { icons } from 'eva-icons';
import { DyIconLibraries, DyIcons } from '../../public_api';
import { DySvgIcon } from '../icon/icon';

interface DyOriginalEvaIcon {
  toSvg(options: DyEvaIconOptions);
}

export interface DyEvaIconOptions {
  width: string,
  height: string,
  fill: string,
  animation: {
    type: string,
    hover: boolean,
    infinite: boolean,
  },
}

export class DyEvaSvgIcon extends DySvgIcon {

  constructor(protected name, protected content: DyOriginalEvaIcon) {
    super(name, '');
  }

  getContent(options): string {
    return this.content.toSvg({
      width: '100%',
      height: '100%',
      fill: 'currentColor',
      ...options,
    });
  }
}

@NgModule({})
export class DyEvaIconsModule {

  private NAME = 'eva';

  constructor(iconLibrary: DyIconLibraries) {
    iconLibrary.registerSvgPack(this.NAME, this.createIcons());
    iconLibrary.setDefaultPack(this.NAME);
  }

  private createIcons(): DyIcons {
    return Object
      .entries<DyOriginalEvaIcon>(icons)
      .map(([name, icon]) => {
        return [name, new DyEvaSvgIcon(name, icon)] as [string, DySvgIcon];
      })
      .reduce((newIcons, [name, icon]: [string, DySvgIcon]) => {
        newIcons[name] = icon;
        return newIcons;
      }, {});
  }
}
