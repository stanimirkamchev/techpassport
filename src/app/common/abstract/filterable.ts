import { Sort } from '@angular/material/sort';
import { get, isNumber } from 'lodash';

import { Identifiable } from './identifiable';
import { FilterBase } from '@models/filters';

export abstract class FilterAbstract<T extends Identifiable, K extends FilterBase> {
  items: T[];

  constructor(items: T[]) {
    this.items = [...items];
  }

  abstract filter(filters: K): FilterAbstract<T, K>;

  sort(sort: Sort): FilterAbstract<T, K> {
    if (sort && sort.active) {
      const reverse = sort.direction === 'desc' ? -1 : 1;
      this.items = this.items.sort((a, b) => {
        const aValue = get(a, sort.active) || 0;
        const bValue = get(b, sort.active) || 0;
        return isNumber(aValue) && isNumber(bValue)
          ? (aValue > bValue ? reverse : reverse * -1)
          : (get(a, sort.active) + '').toLocaleLowerCase().localeCompare((get(b, sort.active) + '').toLocaleLowerCase()) * reverse;
      });
    }
    return this;
  }

  get(): T[] {
    return this.items;
  }
}
