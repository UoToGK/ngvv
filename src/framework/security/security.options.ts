import { InjectionToken } from '@angular/core';

export interface DyAclRole {
  parent?: string,
  [permission: string]: string|string[]|undefined,
}

export interface DyAccessControl {
  [role: string]: DyAclRole,
}

export interface DyAclOptions {
  accessControl?: DyAccessControl,
}

export const DY_SECURITY_OPTIONS_TOKEN = new InjectionToken<DyAclOptions>('Nebular Security Options');
