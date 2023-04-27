import { createAction, props } from '@ngrx/store';
import { Buyer, BuyerEntity, BuyerForm } from './buyer.model';
import { Customer } from 'src/app/admin/store/customer/customer.model';

export const startBuyerOnboarding = createAction(
  '[Onboarding] Start Buyer Onboarding',
  props<{ buyer?: Buyer, step?: number }>()
);

// editBuyer
export const editBuyer = createAction(
  '[Onboarding/API] Edit Buyer',
  props<{ id: string }>()
);

// setCustomerOnboarding
export const setCustomerOnboarding = createAction(
  '[Onboarding/API] Set Customer Onboarding',
  props<{ customer: any }>()
);

// unsetCustomerOnboarding
export const unsetCustomerOnboarding = createAction(
  '[Onboarding/API] Unset Customer Onboarding'
);


// createBuyerOnboarding
export const createBuyerOnboarding = createAction(
  '[Onboarding] Create Buyer Onboarding',
  props<{ entity: BuyerEntity }>()
);

export const createBuyerOnboardingSuccess = createAction(
  '[Onboarding] Create Buyer Onboarding Success',
  props<{ buyer: Partial<Buyer>, step?: 'entity' }>()
);

export const createBuyerOnboardingError = createAction(
  '[Onboarding] Create Buyer Onboarding Error',
  props<{ error: any }>()
);


// patchBuyerOnboarding
export const patchBuyerOnboarding = createAction(
  '[Onboarding] Patch Buyer Onboarding',
  props<{ id: string, buyer: Partial<Buyer>, step?: string, isEditing?: boolean }>()
);

export const patchBuyerOnboardingSuccess = createAction(
  '[Onboarding] Patch Buyer Onboarding Success',
  props<{ id: string, buyer: Partial<Buyer>, step?: string }>()
);

export const patchBuyerOnboardingError = createAction(
  '[Onboarding] Patch Buyer Onboarding Error',
  props<{ error: any }>()
);


// createBuyerCompanyOnboarding
export const createBuyerCompanyOnboarding = createAction(
  '[Onboarding] Create Buyer Company Onboarding',
  props<{ buyerId: string, entity: BuyerEntity }>()
);

export const createBuyerCompanyOnboardingSuccess = createAction(
  '[Onboarding] Create Buyer Company Onboarding Success',
  props<{ buyerId: string, buyer: Partial<Buyer> }>()
);

export const createBuyerCompanyOnboardingError = createAction(
  '[Onboarding] Create Buyer Company Onboarding Error',
  props<{ error: any }>()
);


// patchBuyerCompanyOnboarding
export const patchBuyerCompanyOnboarding = createAction(
  '[Onboarding] Patch Buyer Company Onboarding',
  props<{ buyerId: string, id: string, buyer: Partial<Buyer>, step?: string }>()
);

export const patchBuyerCompanyOnboardingSuccess = createAction(
  '[Onboarding] Patch Buyer Company Onboarding Success',
  props<{ buyerId: string, id: string, buyer: Partial<Buyer>, step?: string }>()
);

export const patchBuyerCompanyOnboardingError = createAction(
  '[Onboarding] Patch Buyer Company Onboarding Error',
  props<{ error: any }>()
);

export const uploadContractTemplateBuyer = createAction(
  '[Onboarding/API] Buyer Contract Template',
  props<{ buyerId: string, contractType: string, file: File }>()
);
export const uploadContractTemplateCompleted = createAction(
  '[Onboarding/API] Buyer Contract Template',
  props<{ _id: string, contractType: string, fileCheck: string, status: string, hash: string }>()
);
