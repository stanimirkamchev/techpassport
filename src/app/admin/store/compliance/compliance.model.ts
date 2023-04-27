import { OnboardingStatus, SupplierReview, Supplier } from '../supplier/supplier.model';
import { DateRange, MultiSelectable, FilterBase } from '@models/filters';
import { Product } from '../product/product.model';
import { IAssessmentsElement } from '@services/assesment/assessment.service';
import { FilterAbstract } from '@abstract/filterable';

export interface Compliance {
  _id: string;
  supplierName: string;
  overallCompliance: number;
  securityQs: number;
  cyber: number;
  antiBribery: number;
  sanctions: number;
  antiMoneyLaundering: number;
  remuneration: number;
  supplyChain: number;
  healthAndSafety: number;
  whistleblowing: number;
  adminReviewer: string;
}

export interface ComplianceFilters extends FilterBase {
  onboardingStatus?: MultiSelectable<OnboardingStatus>;
  signupDate?: DateRange;
  adminReviewer?: MultiSelectable<string>;
}

export const complianceProps = {
  supplierName: 'Supplier Name',
  overallCompliance: 'Overall Compliance',
  securityQs: 'Security Qs',
  cyber: 'Cyber',
  antiBribery: 'Anti-Bribery',
  sanctions: 'Sanctions',
  antiMoneyLaundering: 'Anti-Money Laundering',
  remuneration: 'Remuneration',
  supplyChain: 'Supply Chain',
  healthAndSafety: 'Health & Safety',
  whistleblowing: 'Whistleblowing',
  adminReviewer: 'TP Admin Owner'
};

export interface ComplianceDetails {
  supplier: Supplier;
  review: SupplierReview;
  assessment: IAssessmentsElement[];
  products: Product[];
  complianceItems?: ComplianceItems;
  informationSecurity?: any;
}

export interface ComplianceItem {
  _id: string;
  id: string;
  supplier: string;
  fileCheck: {
    status: string;
    removed: boolean;
    _id: string;
    user: string;
    hash: string;
    file: string;
    av_data_id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    message: string;
    s3Key: string;
  };
  file: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  answer: string;
  compliant: string;
  evidenceDescription: string;
  status: string;
  hash: string;
}

export type ComplianceItems = ComplianceItem[];

export class ComplianceBuilder extends FilterAbstract<Compliance, ComplianceFilters> {

  constructor(compliances: Compliance[]) {
    super(compliances);
  }

  filter(filters: ComplianceFilters): ComplianceBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i.supplierName).toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      return matched;
    });
    return this;
  }
}
