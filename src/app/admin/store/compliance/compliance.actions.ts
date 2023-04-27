import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Compliance, ComplianceFilters, ComplianceDetails } from './compliance.model';
import { Sort } from '@angular/material/sort';


// loadCompliances
export const loadCompliances = createAction(
  '[Compliance/API] Load Compliances'
);

export const loadCompliancesSuccess = createAction(
  '[Compliance/API] Load Compliances Success',
  props<{ compliances: Compliance[] }>()
);

export const loadCompliancesError = createAction(
  '[Compliance/API] Load Compliances Error',
  props<{ error: any }>()
);


// filterCompliances sortCompliances
export const filterCompliances = createAction(
  '[Compliance/API] Filter Compliances',
  props<{ filters: ComplianceFilters }>()
);

export const sortCompliances = createAction(
  '[Compliance/API] Sort Compliances',
  props<{ sort: Sort }>()
);


// downloadCompliances
export const downloadCompliances = createAction(
  '[Compliance/API] Load Download Compliances',
  props<{ compliances: Compliance[] }>()
);


// loadComplianceDetails
export const loadComplianceDetails = createAction(
  '[Compliance/API] Load Compliance Details',
  props<{ id: string }>()
);

export const loadComplianceDetailsSuccess = createAction(
  '[Compliance/API] Load Compliance Details Success',
  props<{ complianceDetails: ComplianceDetails }>()
);

export const loadComplianceDetailsError = createAction(
  '[Compliance/API] Load Compliance Details Error',
  props<{ error: any }>()
);
