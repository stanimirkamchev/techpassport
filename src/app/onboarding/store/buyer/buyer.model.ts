import { Identifiable } from '@abstract/identifiable';

export const buyerEntityProps = ['name', 'country', 'type', 'companyNumber', 'address1', 'address2', 'city', 'postcode'];

export interface BuyerForm {
  _id?: string;
  entity: BuyerEntity;
  invoices: BuyerInvoices;
  group: BuyerGroup & {
    buyerCompanyId: string;
    creatingNew: boolean;
    company: {
      entity: BuyerEntity;
      invoices: BuyerInvoices;
    }
  };
  sanctions: BuyerSanctions;
  dummy: BuyerDummy;
  saml: BuyerSaml;
}

export interface BuyerDummy extends Identifiable {
  onlyDummy: boolean;
}

export interface BuyerSanctions extends Identifiable {
  countries: string[];
}

export interface BuyerSaml extends Identifiable {
  isSamlAuthenticated: boolean;
}
export interface BuyerInvite extends Identifiable {
  email: string;
  isSamlAuthenticated?: boolean;
  isEditing?: boolean
}

export interface BuyerGroup extends Identifiable {
  acceptGroupEntityDefinition: boolean;
  customGroupEntityDefinition?: string;
}

export interface BuyerInvoices extends Identifiable {
  timeframe?: number;
  requirements: string;
  specialConditions?: string;
  noticesAddress1: string;
  noticesAddress2?: string;
  noticesCountry: string;
  noticesPostcode: string;
}

export interface BuyerEntity extends Identifiable {
  name: string;
  country: string;
  type: string;
  companyNumber: string;
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  rapidPOC: boolean;
  rapidInfo: boolean;
  zeroTrialFee: boolean;
  allowComments: boolean;
  isSamlAuthenticated?: boolean;
  allowUseCases: boolean;
  requireNDA: boolean;
}


export interface BuyerContractTemplate {
  _id?: string;
  hash?: string;
  status?: string;
  fileCheck?: string;
  errorMessage?: string;
  uploadingFile: boolean;
  contractType: string;
  label: string;
}

export type Buyer = Identifiable & BuyerEntity & BuyerInvoices & BuyerGroup & BuyerSanctions & BuyerDummy & BuyerInvite;
