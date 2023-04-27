import { get } from 'lodash';

import { FilterAbstract } from '@abstract/filterable';
import { FilterBase } from '@models/filters';
import { Identifiable } from '@abstract/identifiable';
import { SupplierReview } from '../supplier/supplier.model';

export interface ProductSupplier extends Identifiable {
  name: string;
}

export enum ProductStatus {
  Draft = 'Draft',
  Created = 'Created',
  SentForApproval = 'Awaiting Approval',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export interface ProductReviewer extends Identifiable {
  displayName: string;
  email: string;
}

export interface ProductReviewDetails extends Identifiable {
  date: Date;
  comment: string;
  reviewer: ProductReviewer;
}

export interface Product extends Identifiable {
  name: string;
  description: string;
  type: string;
  tags: string[];
  updatedAt: Date;
  createdAt: Date;
  supplier: ProductSupplier;
  status: ProductStatus;
  review: ProductReviewDetails;
}

export interface ProductsFilters extends FilterBase {
  reviewer?: string;
  tag?: string;
  status?: ProductStatus;
}

export interface ProductDetails {
  product: Product;
  review: ProductReview;
  supplier: SupplierReview;
  assessment?: any;
  informationSecurity?: any;
}

export enum ReviewBoolean {
  yes = 'yes',
  no = 'no',
  'n/a' = ''
}

export interface ProductReviewStatus {
  status: ProductStatus;
  _id: string;
  product: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ReviewItem {
  key: string;
  qId: string;
  title: string;
  value: string;
}
export interface ProductReview extends Identifiable {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  details: {
    product: string;
    details: ReviewItem[];
    licensing: ReviewItem[];
    access: ReviewItem[];
    charges: ReviewItem[];
    specialConditions: ReviewItem[];
    __v: number;
  };
  updatedAt: Date;
  createdAt: Date;
  supplier: {
    _id: string;
    name: string
  };
  status: ProductReviewStatus;
  review: ProductReviewDetails[];
  tpWriteAccess: boolean;
}

export class ProductsBuilder extends FilterAbstract<Product, ProductsFilters> {

  constructor(products: Product[]) {
    super(products);
  }

  filter(filters: ProductsFilters): ProductsBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i.name + i.description + i.supplier.name + i.tags.join(''))
          .toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      if (filters.status) {
        matched = matched && i.status === filters.status;
      }
      if (filters.tag) {
        matched = matched && i.tags.indexOf(filters.tag) > -1;
      }
      if (filters.reviewer) {
        matched = matched && get(i, 'review.reviewer._id') === filters.reviewer;
      }
      return matched;
    });
    return this;
  }
}
