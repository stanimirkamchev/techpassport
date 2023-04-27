
import { Identifiable } from '@abstract/identifiable';
import { FilterAbstract } from '@abstract/filterable';
import { FilterBase } from '@models/filters';
export interface Customer extends Identifiable {
  subEntity: boolean;
  phone: string;
  status: string;
  name: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  address1: string;
  postcode: string;
  city: string;
  companyNumber: string;
  allowComments: boolean;
  isSamlAuthenticated?: boolean;
  zeroTrialFee: boolean;
  allowUseCases: boolean;
  requireNDA: boolean;
}

export enum CustomerStatus {
  started = 'Started',
  inprogress = 'In Progress',
  onboarded = 'Onboarded'
}

export interface CustomersFilters extends FilterBase {
  status?: string;
}

export class CustomersBuilder extends FilterAbstract<Customer, CustomersFilters> {

  constructor(products: Customer[]) {
    super(products);
  }

  filter(filters: CustomersFilters): CustomersBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i.name)
          .toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      if (filters.status) {
        matched = matched && i.status === filters.status;
      }
      // if (filters.tag) {
      //   matched = matched && i.tags.indexOf(filters.tag) > -1;
      // }
      // if (filters.reviewer) {
      //   matched = matched && get(i, 'review.reviewer._id') === filters.reviewer;
      // }
      return matched;
    });
    return this;
  }
}
