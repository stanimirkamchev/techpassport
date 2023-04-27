interface Identifiable {
  orgId: number;
}
export interface OuterMarketTableModel extends Identifiable {
  recordStatus: RecordStatus;
  company: string;
  url: string;
  description: string;
  taxonomy: string;
  country: string;
  totalFunding: number;
  latestFundingRound: string;
  latestFundingDate: string | Date;
  latestFundingAmount: number | null;
  investors: Array<string>;
  latestValuation: number | null;
  acquirers: Array<string>;
  latestRevenueMin: number | null;
  latestRevenueMax: number | null;
  revenueTimePeriod: string | null;
  competitors: Array<string>;
  mosaic: number | null;
  invitationStatus: InvitationStatus;
  isFreezed: false;
}

export enum InvitationStatus {
  NOT_INVITED = 'not invited',
  ONBOARDED = 'onboarded',
  INVITED = 'invited'
}

export enum RecordStatus {
  NEW = 'New',
  UPDATED = 'Updated',
  DELETED = 'Deleted',
  UNMATCHED = 'Unmatched'
}
