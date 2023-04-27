export interface InviteSuppliersTableModel {
  _id: string;
  user: any;
  customer: any;
  entityMember: any;
  receiver: string;
  recordType: 'email' | 'website' | 'outermarket' | '';
  status: InvitationStatus;
  supplier: any | null;
  userNote: string;
  tppNote: string | null;
  dateOnboarded: Date | null;
  createdAt: Date;
  updatedAt: Date;
  requestUpdateDate: Date | null;
}

export interface InvitationFilterPreview {
  status: string[];
  type: string[];
  userType: string[];
  company: string[];
  emailAddress: string[];
}

export interface InvitationFilter {
  status: InvitationStatus;
  type: InvitationType;
  userType: InvitationUserType;
  company: string | null;
  emailAddress: string | null;
  dateFrom: Date | string | null;
  dateTo: Date | string | null;
  search?: string;
}

export interface Paginator {
  pageIndex: number;
  pageSize: number;
  total: number;
  dataCount: number;
}

export enum InvitationStatus {
  ALL = 'all',
  INVITED = 'invited',
  ONBOARDED = 'onboarded',
  REJECTED = 'rejected'
}

export enum InvitationType {
  ALL = 'all',
  EMAIL = 'email',
  WEBSITE = 'website',
  OM = 'outermarket'
}

export enum InvitationUserType {
  ALL = 'all',
  OWNER = 'owner',
  REQUESTOR = 'Requestors',
  SUPER_USER = 'Super Users'
}
