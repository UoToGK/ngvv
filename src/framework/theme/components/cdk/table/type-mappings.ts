import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  RowContext,
} from '@angular/cdk/table';

export const DyCdkRowDef = CdkRowDef;
export const DyCdkRow = CdkRow;
export const DyCdkCellDef = CdkCellDef;

export const DyCdkHeaderRowDef = CdkHeaderRowDef;
export const DyCdkHeaderRow = CdkHeaderRow;
export const DyCdkHeaderCellDef = CdkHeaderCellDef;

export const DyCdkFooterRowDef = CdkFooterRowDef;
export const DyCdkFooterRow = CdkFooterRow;
export const DyCdkFooterCellDef = CdkFooterCellDef;

export const DyCdkColumnDef = CdkColumnDef;

export const DyCdkCell = CdkCell;
export const DyCdkHeaderCell = CdkHeaderCell;
export const DyCdkFooterCell = CdkFooterCell;

export type DyRowContext<T> = RowContext<T>;
