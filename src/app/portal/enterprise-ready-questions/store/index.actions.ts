import { createAction, props } from '@ngrx/store';
import { IErqDto } from '../models/erq-dto';

// loadProducts
export const loadDataTable = createAction(
  '[ERQ/API] Load Data Table'
);

export const loadDataTableSuccess = createAction(
  '[ERQ/API] Load Data Table Success',
  props<{ data: IErqDto }>() // ERQModel
);

export const loadDataTableError = createAction(
  '[ERQ/API] Load Data Table Error',
  props<{ error: any }>()
);
