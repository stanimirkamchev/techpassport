import { Identifiable } from '@abstract/identifiable';
import { FilterBase } from '@models/filters';
import { FilterAbstract } from '@abstract/filterable';

export enum PocStatus {
  canceled = 'Canceled',
  completed = 'Completed',
  ongoing = 'Ongoing'
}

export enum ConnectionStatus {
  awaitingBuyer = 'Awaiting Buyer',
  awaitingSupplier = 'Awaiting Supplier',
  ndaCompleted = 'NDA Completed'
}

export interface DashboardProjectPOC extends Identifiable {
  name: string;
  dateFrom: Date;
  dateTo: Date;
  supplier: string;
  product: string;
  duration: number;
  pocStatus: PocStatus;
  connectionStatus: ConnectionStatus;
  productID: string;
}

export interface DashboardProject extends DashboardProjectPOC {
  name: string;
  dateFrom: Date;
  dateTo: Date;
  totalProjects: number;
  totalProducts: number;
  duration: number;
  pocStatus: PocStatus;
  connectionStatus: ConnectionStatus;
  pocs: DashboardProjectPOC[];
  justification?: string;
}

export interface DashboardProjectFilters extends FilterBase {
  name?: string;
  supplier?: string;
  product?: string;
}

export class ProjectsBuilder extends FilterAbstract<DashboardProject, DashboardProjectFilters> {

  constructor(projects: DashboardProject[]) {
    super(projects);
  }

  filter(filters: DashboardProjectFilters): ProjectsBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.name) {
        matched = matched && i.name === filters.name;
      }
      if (filters.supplier) {
        matched = matched && typeof i.pocs.find(s => s.supplier === filters.supplier) !== 'undefined';
      }
      if (filters.product) {
        matched = matched && typeof i.pocs.find(s => s.product === filters.product) !== 'undefined';
      }
      return matched;
    });
    return this;
  }
}

export interface Suppliers extends Identifiable {
  supplier: string;
  dateEstablished: Date;
  fundingRound: string;
  website: string;
  productsAvailable: number;
  nda: number;
  rapidPoc: number;
}

export interface DashboardKPIs {
  marketPlace: any;
  searches: any;
  technologies: any;
  /*suppliers: number;
   suppliersTotal: number;
   searches: number;
   searchesTotal: number;
   technologies: number;
   technologiesTotal: number;*/
}

export interface DashboardAlerts {
  pendingNDAs: number;
  urgentNDAs: number;
  pendingPOCs: number;
  urgentPOCs: number;
  pendingProjects: number;
  urgentProjects: number;
}

export interface DashboardSecurityTrends {
  data: any;
  total: number;
  title?: string
}

export interface DashboardResource {
  total: number;
  pending: number;
  completed: number;
  canceled: number;
}

export interface DashboardResourceUserDataItem {
  x: Date;
  y: number;
}

export interface DashboardResourceUserData {
  total: DashboardResourceUserDataItem[];
  pending: DashboardResourceUserDataItem[];
  completed: DashboardResourceUserDataItem[];
  canceled: DashboardResourceUserDataItem[];
}

export interface DashboardResourceUser {
  _id: string
  name: string;
  data: DashboardResourceUserData;
}

export interface DashboardResources {
  overall: DashboardResource,
  users: DashboardResourceUser[]
}

export interface Dashboard {
  kpis: DashboardKPIs;
  alerts: DashboardAlerts;
  trends: DashboardSecurityTrends;
  projects: DashboardProject[];
  resources: DashboardResources;
}

export interface DashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  country?: string;
  bankContext?: string;
}


export interface MarketPreview extends Identifiable {
  business1: string;
  business2: string;
  businessUnit: string;
  ndaDate: Date;
  poc: string;
  pocDate: string;
  postPOC: string;
  procurment2: string;
  product: string;
  projectId: string;
  projectName: string;
  region: string;
  supplier: string;
  hasPOC: string;
  hasCompliance: string;
  originator: string;
}

export interface SearchesPreview extends Identifiable {
  country: string[];
  functionality: string[];
  //haveConversation?: boolean;
  haveNDA: boolean;
  havePOC: boolean;
  productsFound: number;
  searchDate: Date;
  suppliersFound: number;
  //technology: string;
  user: string;
}

export interface TechnologyPreview extends Identifiable {
  functionality: string,
  compliance: string,
  POC: string,
  projectName: string,
  originator: string,
  region: string,
  businessUnit: string,
  ndaDate: Date,
  pocDate: Date
}

export interface TrendsPreview extends Identifiable {
  projectName: string;
  projectId: string;
  haveNDA: string;
  ndaDate: string;
  havePOC: string;
  region: string;
  businessUnit: string;
  business1: string;
  business2: string;
  procurment2: string;


  supplier: string;

  hasSoc2: string;
  hasISO27001: string;
  hasCyberEssentials: string;
  hasCyberEssentialsPlus: string;
  allSecurityQuestions: string;

}

export class MarketPreviewBuilder extends FilterAbstract<MarketPreview, any> {

  constructor(preview: MarketPreview[]) {
    super(preview);
  }

  filter(filters: any): MarketPreviewBuilder {
    return this;
  }
}

export class SearchesPreviewBuilder extends FilterAbstract<SearchesPreview, any> {

  constructor(preview: SearchesPreview[]) {
    super(preview);
  }

  filter(filters: any): SearchesPreviewBuilder {
    return this;
  }
}

export class TechnologyPreviewBuilder extends FilterAbstract<TechnologyPreview, any> {

  constructor(preview: TechnologyPreview[]) {
    super(preview);
  }

  filter(filters: any): TechnologyPreviewBuilder {
    return this;
  }
}

export class TrendsPreviewBuilder extends FilterAbstract<TrendsPreview, any> {

  constructor(preview: TrendsPreview[]) {
    super(preview);
  }

  filter(filters: any): TrendsPreviewBuilder {
    return this;
  }
}


export interface BankShortlistItem {
  subEntity: string;
  phone: string;
  status: string;
  _id: string;
  name: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
  address1: string;
  postcode: string;
  city: string;
  companyNumber: string;
}
