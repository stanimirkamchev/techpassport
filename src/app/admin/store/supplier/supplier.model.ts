import { Sort } from '@angular/material/sort';
import { FilterAbstract } from '@abstract/filterable';
import { Product, ReviewBoolean } from '../product/product.model';
import { Identifiable } from '@abstract/identifiable';
import { ReviewLog } from '@shared/review-log/review-log.component';

export enum OnboardingStatus {
  onboarded = 'Onboarded',
  onboarding = 'Onboarding'
}

export enum SupplierMembership {
  premium = 'Premium',
  core = 'Core',
}

export enum OptInStatus {
  yes = 'Opt-In',
  no = 'Opt-Out',
}

export enum SupplierStatus {
  Approved = 'Approved',
  Draft = 'Draft',
  SentForApproval = 'Sent for Approval',
  Rejected = 'Rejected',
  Created = 'Created',
  started = 'Started'
}

export interface SupplierUser {
  displayName: string;
  email: string;
}

export interface SupplierReviewDetails {
  displayName: string;
  email: string;
  status: SupplierStatus;
  subject: string;
  comment: string;
  date: Date;
}

export interface Supplier extends Identifiable {
  name: string;
  onboardingStatus: OnboardingStatus;
  updatedAt: Date;
  createdAt: Date;
  displayName: string;
  phone: string;
  email: string;
  numberOfUsers: number;
  members: string;
  optIn: OptInStatus;
  numberOfProducts: number;
  numberOfProductsApproved: number;
  status: SupplierStatus;
  owner: SupplierUser;
  review: SupplierReviewDetails;
  isSupplier: boolean;
}

export interface SuppliersFilters {
  supplierStatus?: SupplierStatus;
  optInStatus?: OptInStatus;
  sort?: Sort;
  search?: string;
}

export interface SupplierDetails {
  supplier: Supplier;
  review: SupplierReview;
  products: Product[];
  assessment?: any;
  informationSecurity?: any;
}

export interface SupplierReview {
  name: string;
  email?: string;
  members: string;
  country: string;
  incorporated: string;
  companyNumber: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  createdAt: Date;
  insurance: any;
  companyWebsite: string;
  companyStage: string;
  owner: {
    email: string;
    phone: string;
  };
  auditing: {
    auditRights: ReviewBoolean;
    thirdPartyAuditRights: ReviewBoolean;
  };
  review?: ReviewLog;
  tpWriteAccess: boolean;
}

export class SuppliersBuilder extends FilterAbstract<Supplier, SuppliersFilters> {

  constructor(products: Supplier[]) {
    super(products);
  }

  filter(filters: SuppliersFilters): SuppliersBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i.name + i.owner.displayName).toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      if (filters.supplierStatus) {
        matched = matched && SupplierStatus[i.status] === filters.supplierStatus;
      }
      return matched;
    });
    return this;
  }
}
