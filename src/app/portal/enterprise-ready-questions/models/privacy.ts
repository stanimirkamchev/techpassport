import { ErqBase } from './erq-base';
import { IPrivacyDTO } from './erq-dto';

export interface CountryRegionOptions {
  country_uk: boolean;
  country_usa: boolean;
  country_canada: boolean;
  country_eu: boolean;
  country_none: boolean;
}


export interface RegionalLegislationAreas {
  legislation_uk: boolean;
  legislation_usa: boolean;
  legislation_canada: boolean;
  legislation_eu: boolean;
}

export interface ProtectionActOptions {
  gdpr: boolean;
  ccpa: boolean;
  pipeda: boolean;
  other: boolean;
  otherText: string | null;
}

export interface WhereDataIsConsumed {
  data_consumed_uk: boolean;
  data_consumed_usa: boolean;
  data_consumed_canada: boolean;
  data_consumed_eu: boolean;
  data_consumed_no: boolean;
}

export interface InclusionPermissions {
  yes: boolean;
  no: boolean;
}

export interface IPrivacy {
  countryRegionOptions: CountryRegionOptions;
  regionalLegislationAreas: RegionalLegislationAreas;
  protectionActOptions: ProtectionActOptions;
  whereDataIsConsumed: WhereDataIsConsumed;
  inclusionPermissions: InclusionPermissions;
}

export class Privacy extends ErqBase<IPrivacy> {

  constructor(payload: IPrivacyDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IPrivacyDTO): void {
    this.values = {
      countryRegionOptions: {
        country_uk: payload?.country_uk ?? null,
        country_usa: payload?.country_usa ?? null,
        country_canada: payload?.country_canada ?? null,
        country_eu: payload?.country_eu ?? null,
        country_none: payload?.country_none ?? null,
      },
      regionalLegislationAreas: {
        legislation_uk: payload?.legislation_uk ?? null,
        legislation_usa: payload?.legislation_usa ?? null,
        legislation_canada: payload?.legislation_canada ?? null,
        legislation_eu: payload?.legislation_eu ?? null,
      },
      protectionActOptions: {
        gdpr: payload?.gdpr ?? null,
        ccpa: payload?.ccpa ?? null,
        pipeda: payload?.pipeda ?? null,
        other: payload?.other ?? null,
        otherText: payload?.otherText ?? null
      },
      whereDataIsConsumed: {
        data_consumed_uk: payload?.data_consumed_uk ?? null,
        data_consumed_usa: payload?.data_consumed_usa ?? null,
        data_consumed_canada: payload?.data_consumed_canada ?? null,
        data_consumed_eu: payload?.data_consumed_eu ?? null,
        data_consumed_no: payload?.data_consumed_no ?? null,
      },
      inclusionPermissions: {
        yes: payload?.yes ?? null,
        no: payload?.no ?? null,
      }
    };
  }
}
