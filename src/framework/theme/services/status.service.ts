

import { Injectable } from '@angular/core';

import { DyComponentOrCustomStatus, DyComponentStatus } from '../components/component-status';

@Injectable()
export class DyStatusService {
  readonly coreStatuses: DyComponentStatus[] = ['basic', 'primary', 'info', 'warning', 'danger', 'control'];

  isCoreStatus(status: DyComponentOrCustomStatus): boolean {
    return this.coreStatuses.includes(status as DyComponentStatus);
  }

  isCustomStatus(status: DyComponentOrCustomStatus): boolean {
    if (this.isValidStatusString(status)) {
      return !this.isCoreStatus(status);
    }

    return false;
  }

  getStatusClass(status: DyComponentOrCustomStatus): string | undefined {
    if (this.isValidStatusString(status)) {
      return `status-${status}`;
    }

    return undefined;
  }

  protected isValidStatusString(status: DyComponentOrCustomStatus): boolean {
    return typeof status === 'string' && status.length > 0;
  }
}
