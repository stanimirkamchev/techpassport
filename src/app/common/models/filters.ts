import { Sort } from '@angular/material/sort';

export const filterDebounce = 300;

export interface DateRange {
  from: Date;
  to: Date;
}

export type MultiSelectable<T> = T[];

export interface FilterBase {
  search?: string;
}
