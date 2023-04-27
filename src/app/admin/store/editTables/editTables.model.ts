
import { Identifiable } from '../../../common/abstract/identifiable';

export interface Table extends Identifiable {
  loaded: boolean,
  loading: boolean,
  tags: any;
  taxonomies: any;
  solutions: any;
  frameworks: any;
}

export enum EditStatus {
  edit = 'Edit',
  delete = 'Delete',
  add = 'Add',
}

