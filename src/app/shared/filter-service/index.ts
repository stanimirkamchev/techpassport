import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OuterMarketTableModel } from '../../portal/+outer-market-page/outerMarket.models';
import { SelectionModel } from '@angular/cdk/collections';
import { TFilterDetail } from '@shared/types/TFilterDetail';
import * as moment from 'moment';
import { EUCountryHelper } from './../../shared/helpers/euCountry.helper';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterDetail: TFilterDetail = {
    sent: false,
    outputFilteredData: {},
    resultFilteredData: {},
    search: '',
    sortBy: 'topRated',
  };
  private filterResCounter = 0;
  private filterCounter = 0;
  private isSelectAll = false;
  private selectedData = new SelectionModel<any>(true, []);
  private watchLists: any[] = [];
  private pagination = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    dataCount: 0
  };

  private $filterServiceSource = new BehaviorSubject(this.filterDetail);
  private $filterResCounter = new BehaviorSubject(this.filterResCounter);
  private $filterCounter = new BehaviorSubject(this.filterCounter);
  private $filterSelectAll = new BehaviorSubject(this.isSelectAll);
  private $selectedDataBehavior = new BehaviorSubject(this.selectedData);
  private $watchListsBehavior = new BehaviorSubject(this.watchLists);
  private $paginationBehavior = new BehaviorSubject(this.pagination);

  public readonly filterOverview: Observable<TFilterDetail> = this.$filterServiceSource.asObservable();
  public readonly filterResCounterOverview: Observable<number> = this.$filterResCounter.asObservable();
  public readonly filterCounterOverview: Observable<number> = this.$filterCounter.asObservable();
  public readonly filterSelectAllOverview: Observable<boolean> = this.$filterSelectAll.asObservable();
  public readonly selectedDataOverview: Observable<SelectionModel<any>> = this.$selectedDataBehavior.asObservable();
  public readonly watchListsOverview: Observable<any[]> = this.$watchListsBehavior.asObservable();
  public readonly paginationOverview: Observable<any> = this.$paginationBehavior.asObservable();

  constructor() {
    this.$filterResCounter.next(0);
    this.$filterCounter.next(0);
    this.$filterSelectAll.next(false);
  }

  attachData(data: { sent: boolean, outputFilteredData: any, resultFilteredData: any }): void {
    this.$filterServiceSource.next({
      ...this.$filterServiceSource.getValue(),
      ...data
    });
    let count = 0;
    Object.entries(data.outputFilteredData).forEach(entry => {
      if (entry[0] === 'totalFunding' || entry[0] === 'latestFundingDate' || entry[0] === 'latestValuation') {
        count += Object.values(entry[1]).filter(e => e && e !== 0).length;
      } else {
        count += (entry[1] as any[]).length;
      }
    });
    this.$filterCounter.next(count);
  }

  setFilteredData(data: OuterMarketTableModel[], resultFilteredData: {}) {
    if (Object.keys(resultFilteredData).length !== 0) {
      const res = data.filter(el => {
        return [resultFilteredData].some((f: any) => {
          return (f.totalFunding.some(r => el.totalFunding === r) && el.totalFunding != null || f.totalFunding.length === 0)
            && (f.taxonomy.some(r => el.taxonomy.includes(r)) || f.taxonomy.length === 0)
            && (f.company.some(r => el.company.includes(r)) || f.company.length === 0)
            && (f.country.some(r => el.country.includes(r)) || f.country.length === 0)
            && (f.latestFundingRound.some(r => el.latestFundingRound.includes(r)) || f.latestFundingRound.length === 0)
            && (f.investors.some(r => el.investors.includes(r)) || f.investors.length === 0)
            && (f.latestValuation.some(r => el.latestValuation === r) && el.latestValuation != null || f.latestValuation.length === 0)
            && (f.acquirers.some(r => el.acquirers.includes(r)) || f.acquirers.length === 0)
            && (f.latestFundingDate.some(r => (el.latestFundingDate as any).includes(r)) || f.latestFundingDate.length === 0);
        });
      });
      this.$filterResCounter.next(res.length);
      return res;
    } else {
      this.$filterResCounter.next(0);
      return data;
    }
  }

  setFiltereMarketplaceData(products: any[], filters: any, sortBy?: string) {
    if (Object.keys(filters).length !== 0) {

      // FILTER TAXONOMY
      products = filters.taxonomy && filters.taxonomy.length ? products.filter(p => {
        let filteredTaxonomy = [];
        let filteredTypes = [];
        if (p.raw.productdetails?.details?.taxonomy) {
          filteredTaxonomy = filters.taxonomy.filter(taxonomy => p.raw.productdetails?.details?.taxonomy.includes(taxonomy));
        }
        if (p.raw.productdetails?.details?.type) {
          filteredTypes = filters.taxonomy.filter(taxonomy => p.raw.productdetails?.details?.type.includes(taxonomy));
        }
        return [...filteredTaxonomy, ...filteredTypes].length > 0;
      }) : products;

      // FILTER TAGS
      if (filters?.productTags?.length) {

        products = products.filter((p: any) => {
          let filterTags = [];
          if (p && p.raw.tags) {
            filterTags = p.raw.tags.filter(pt => filters.productTags.includes(pt));
            // filters.productTags.filter(f => p.raw.tags.includes(f));
          }
          return [...filterTags].length > 0;
        });
      }

      // FILTER HOSTING PROVIDER
      products = filters.hostingProvider && filters.hostingProvider.length ? products.filter(p => {
        let filteredDetailsProvider = [];
        let filteredAccessProvider = [];
        if (p.raw.productdetails?.details?.productHosting?.hostLocation) {
          filteredDetailsProvider = filters.hostingProvider.filter(provider => p.raw.productdetails?.details?.productHosting?.hostLocation === provider);
        }
        if (p.raw.productdetails?.access?.hostLocation) {
          filteredAccessProvider = filters.hostingProvider.filter(provider => p.raw.productdetails?.access?.hostLocation === provider);
        }
        return [...filteredDetailsProvider, ...filteredAccessProvider].length > 0;
      }) : products;

      // FILTER GEOLOCATION
      products = filters.geolocation && filters.geolocation.length ? products.filter(p => {
        let filteredDetailsGeo = [];
        let filteredAccessGeo = [];
        if (p.raw.productdetails && p.raw.productdetails?.details?.productHosting && p.raw.productdetails?.details?.productHosting?.multipleHostLocation) {
          filteredDetailsGeo = filters.geolocation.filter(loc => p.raw.productdetails?.details?.productHosting?.multipleHostLocation.includes(loc));
        }
        if (p.raw.productdetails && p.raw.productdetails?.access && p.raw.productdetails?.access?.multipleHostLocation) {
          filteredAccessGeo = filters.geolocation.filter(loc => p.raw.productdetails?.access?.multipleHostLocation.includes(loc));
        }
        return [...filteredDetailsGeo, ...filteredAccessGeo].length > 0;
      }) : products;

      // // FILTER COUNTRY OPERATING IN
      products = filters.countryOperatingIn && filters.countryOperatingIn.length ? products.filter(p => {
        let filteredCountryOperatingIn = [];
        filters.countryOperatingIn = filters.countryOperatingIn.filter(a => a);
        if (p.raw.supplier && p.raw.supplier.country && filters.countryOperatingIn && filters.countryOperatingIn.length) {
          filteredCountryOperatingIn = filters.countryOperatingIn.filter(country => {
            if (country === 'European Union') {
              const codes = EUCountryHelper.countryCode();
              return codes.includes(p.raw.supplier.country.toLowerCase());
            } else {
              return p.raw.supplier.country.toLowerCase() === country.toLowerCase();
            }
          });
        }
        return filteredCountryOperatingIn.length > 0;
      }) : products;

      // FILTER COMPANY AGE
      products = filters.companyAge && filters.companyAge.length ? products.filter(p => {
        const companyAge = filters.companyAge[0];

        const start = p.raw.supplier && p.raw.supplier.incorporated ? moment(p.raw.supplier.incorporated) : moment();
        const end = moment();
        const duration = moment.duration(end.diff(start));
        const age = duration.asYears();
        switch (companyAge) {
          case 'Less than 1 year':
            return age < 1;
          case '1-3 years':
            return age >= 1 && age < 3;
          case '3-5 years':
            return age >= 3 && age < 5;
            break;
          case '5-10 years':
            return age >= 5 && age < 10;
          case 'More than 10 years':
            return age >= 10;
        }
        return false;
      }) : products;

      // FILTER FUNDING ROUND
      products = filters.fundingRound && filters.fundingRound.length
        ? products.filter((p: any) => filters.fundingRound.some(
          (fr: string) => p.raw.supplier
            && p.raw.supplier.companyStage
            && fr.toLowerCase().includes(p.raw.supplier.companyStage.toLowerCase())
        ))
        : products;

      // FILTER FI Worked With
      products = filters.fisWorkedWith && filters.fisWorkedWith.length
        ? products.filter((p: any) => p.raw.supplier
          && p.raw.supplier.experience
          && Array.isArray(p.raw.supplier.experience)
          && p.raw.supplier.experience.some((ex: any) => {
            return filters.fisWorkedWith.includes(ex.sector) && (
              ex.global != null ||
              ex.poc != null ||
              ex.regional != null ||
              ex.serviceAgreements != null
            );
          })
        )
        : products;

      // ERQ % COMPLETE && COMPLIANT
      if ((filters.erqComplete && filters.erqComplete.length) || (filters.erqComplaint && filters.erqComplaint.length)) {

        products = products.filter((pr: any) => {
          if (pr && pr.raw.erq) {
            const compliant = pr.raw.compliant;
            const completed = pr.raw.completed;
            let minComplete = 0;
            let maxComplete = 100;
            let minCompliant = 0;
            let maxCompliant = 100;
            if (filters.erqComplete && filters.erqComplete.length) {
              minComplete = filters.erqComplete[0];
              maxComplete = filters.erqComplete[1];
            }

            if (filters.erqComplaint && filters.erqComplaint.length) {
              minCompliant = filters.erqComplaint[0];
              maxCompliant = filters.erqComplaint[1];
            }
            return minComplete <= completed &&
              completed <= maxComplete &&
              minCompliant <= compliant &&
              compliant <= maxCompliant;
          }
          return false;
        });

      }

      // ERQ % LAST UPDATED
      products = filters.erqLastUpdated && filters.erqLastUpdated.length
        ? products.filter((p: any) => {
          const today = new Date();
          let resultDate: Date;
          let key = '';
          if (filters.erqLastUpdated.length === 2) {
            key = 'Updated in last 6 months';
          } else {
            key = filters.erqLastUpdated[0];
          }

          switch (key) {
            case 'Recently updated':
              resultDate = new Date(today.setDate(today.getDate() - 14));
              break;
            case 'Updated in last 28 days':
              resultDate = new Date(today.setDate(today.getDate() - 28));
              break;
            case 'Updated in last 6 months':
              resultDate = new Date(today.setMonth(today.getMonth() - 6));
              break;
            default:
              return true;
          }

          return p.raw.erq && p.raw.erq.updatedAt && p.raw.erq.updatedAt.getTime() <= resultDate.getTime();
        })
        : products;

      // FILTER USE CASES
      // Missing values in FE
      products = filters.useCases && filters.useCases.length
        ? products.filter((p: any) => filters.useCases.some(
          (us: string) => p.raw.supplier
            && p.raw.productdetails
            && p.raw.productdetails.specialConditions
            && p.raw.productdetails.specialConditions.includes(us.toLowerCase())
          // TODO: waiting the filter payload
        ))
        : products;

      // FILTER COMPANY DIVERSITY
      products = filters.companyDiversity && filters.companyDiversity.length
        ? products.filter((p: any) => filters.companyDiversity.some(
          (cd: string) => {
            if (p.raw.supplier
              && p.raw.supplier.founderIdentify
              && cd === 'Diverse founding members'
              && p.raw.supplier.founderIdentify.length
            ) {
              return true;
            }

            if (p.raw.supplier
              && p.raw.supplier.boardMembersIdentify
              && cd === 'Diverse board members'
              && p.raw.supplier.boardMembersIdentify.length
            ) {
              return true;
            }
            return false;
          }
        ))
        : products;

      // FILTER ACCREDITATION
      products = filters.accreditation && filters.accreditation.length
        ? products.filter((p: any) => filters.accreditation.some(
          (acc: string) => {
            if (p.supplier && p.supplier.isAward && filters.accreditation.includes('Received awards')) {
              return true;
            }

            if (p.raw.supplier && p.raw.supplier.isAward && filters.accreditation.includes('Involved in accelerator programs')) {
              // TODO: p.supplier.???????
              return true;
            }
            return false;
          }
        ))
        : products;

      this.$filterResCounter.next(products.length);
    } else {
      this.$filterResCounter.next(0);
    }

    // SORT
    if (sortBy) {
      if (sortBy === 'topRated') {
        products = products.sort((a, b) => b.raw.compliant - a.raw.compliant);
      } else if (sortBy === 'newest') {
        products = products.sort((a, b) => moment(a.raw.updatedAt).isBefore(b.raw.updatedAt) ? 1 : -1);
      } else if (sortBy === 'oldest') {
        products = products.sort((a, b) => moment(a.raw.updatedAt).isBefore(b.raw.updatedAt) ? -1 : 1);
      } else if (sortBy === 'alphabetic') {
        products = products.sort((a, b) => a.raw.name.trim().localeCompare(b.raw.name.trim()));
      }
    }

    return products;
  }

  setResTotalData(total: number) {
    this.$filterResCounter.next(total);
  }

  clearFilter() {
    this.$filterServiceSource.next({
      sent: false, outputFilteredData: {}, resultFilteredData: {}, search: '', sortBy: 'topRated'
    });
    this.$filterResCounter.next(0);
    this.$filterCounter.next(0);
  }

  setSelectAll() {
    this.$filterSelectAll.next(true);
  }

  setSearch(value: string) {
    this.$filterServiceSource.next({
      ...this.$filterServiceSource.getValue(),
      search: value
    });
  }

  setSortBy(value: string) {
    this.$filterServiceSource.next({
      ...this.$filterServiceSource.getValue(),
      sortBy: value
    });
  }

  setSelectedData(newSelectedData: any[]) {
    const prev = this.$selectedDataBehavior.getValue();
    prev.select(...newSelectedData);
    this.$selectedDataBehavior.next(prev);
  }

  toggleData(data: any) {
    const prev = this.$selectedDataBehavior.getValue();
    prev.toggle(data);
    this.$selectedDataBehavior.next(prev);
    this.$filterSelectAll.next(false);
  }

  clearSelectedData() {
    const prev = this.$selectedDataBehavior.getValue();
    prev.clear();
    this.$selectedDataBehavior.next(prev);
    this.$filterSelectAll.next(false);
  }

  unselectData(row: any) {
    const prev = this.$selectedDataBehavior.getValue();
    prev.deselect(row);
    this.$selectedDataBehavior.next(prev);
    this.$filterSelectAll.next(false);
  }

  replaceData(oldProduct: any, newProduct: any) {
    const prev = this.$selectedDataBehavior.getValue();
    prev.deselect(oldProduct);
    prev.select(newProduct);
    this.$selectedDataBehavior.next(prev);
    this.$filterSelectAll.next(false);
  }

  setWatchLists(data) {
    this.$watchListsBehavior.next(data);
  }

  setPagination(obj) {
    const prevPagination = this.$paginationBehavior.getValue();

    this.$paginationBehavior.next({
      ...prevPagination,
      ...obj
    });
  }
}
