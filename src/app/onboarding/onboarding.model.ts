import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuyerEntity } from './store/buyer/buyer.model';

export interface OnboardingBaseState<T> {
  started?: boolean;
  valid?: boolean;
  value: Partial<T>;
  step?: number;
  steps?: OnboardingStep<T>[];
  touched?: boolean;
}

export interface OnboardingEditable<T> {
  loading: boolean;
  loaded: boolean;
  item: Required<T>;
}

export interface OnboardingStep<T> {
  name: string;
  index: number;
  valid: boolean;
  value: Partial<T>;
  touched?: boolean;
}

export const getEntityFormGroup = (entity: BuyerEntity = {} as BuyerEntity) => new FormGroup({
  _id: new FormControl(''),
  name: new FormControl(entity.name, Validators.required),
  country: new FormControl(entity.country, Validators.required),
  type: new FormControl(entity.type, Validators.required),
  companyNumber: new FormControl(entity.companyNumber, Validators.required),
  address1: new FormControl(entity.address1, Validators.required),
  address2: new FormControl(entity.address2),
  city: new FormControl(entity.city, Validators.required),
  postcode: new FormControl(entity.postcode, Validators.required),
  rapidPOC: new FormControl(entity.rapidPOC),
  rapidInfo: new FormControl(entity.rapidInfo),
  allowComments: new FormControl(entity.allowComments),
  zeroTrialFee: new FormControl(entity.zeroTrialFee),
  allowUseCases: new FormControl(entity.allowUseCases),
  requireNDA: new FormControl(entity.requireNDA)
});

export const getInvoicesFormGroup = () => new FormGroup({
  _id: new FormControl(''),
  timeframe: new FormControl('', Validators.required),
  requirements: new FormControl('', Validators.required),
  specialConditions: new FormControl('', Validators.required),
  noticesAddress1: new FormControl('', Validators.required),
  noticesAddress2: new FormControl('', Validators.required),
  noticesCountry: new FormControl('', Validators.required),
  noticesPostcode: new FormControl('', Validators.required)
});

export enum CompanyType {
  bankT1 = 'Bank T1',
  bankT2 = 'Bank T2',
  bankT3 = 'Bank T3',
  wealthManagement = 'Wealth Management',
  assetManagement = 'Asset Management',
  insurance = 'Insurance',
  lifeAssuranceAndPensions = 'Life Assurance and Pensions',
  regulatory = 'Regulatory'
}



