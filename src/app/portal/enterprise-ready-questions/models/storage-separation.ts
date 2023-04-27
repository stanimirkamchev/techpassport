import { ErqBase } from './erq-base';
import { IStorageSeparationDTO } from './erq-dto';

export interface ServiceProvidedCountryRegions {
  country_uk: boolean;
  country_usa: boolean;
  country_canada: boolean;
  country_eu: boolean;
  country_other: boolean;
  country_other_text: string | null;
}

export interface DataMaintenanceLocations {
  country_uk: boolean;
  country_usa: boolean;
  country_canada: boolean;
  country_eu: boolean;
  country_other: boolean;
  country_other_text: string | null;
}

export interface LogicalSegregation {
  utilize: boolean;
  moreInfo: string | null;
}

export interface SeparateDataSetAccess {
  dataSetAccess: boolean;
  setAccessMoreInfo: string | null;
}

export interface ProcessChangeManagement {
  changeManagement: boolean;
  changeManagementMoreInfo: string | null;
}

export interface IStorageSeparation {
  guaranteeLocation: boolean;
  moreInfo: string | null;
  serviceProvidedCountryRegions: ServiceProvidedCountryRegions;
  dataMaintenanceLocations: DataMaintenanceLocations;
  logicalSegregation: LogicalSegregation;
  separateDataSetAccess: SeparateDataSetAccess;
  processChangeManagement: ProcessChangeManagement;
}

export class StorageSeparation extends ErqBase<IStorageSeparation> {

  constructor(payload: IStorageSeparationDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IStorageSeparationDTO): void {
    this.values = {
      guaranteeLocation: payload?.guaranteeLocation ?? null,
      moreInfo: payload?.moreInfo ?? null,
      serviceProvidedCountryRegions: {
        country_uk: payload?.serviceCountry_uk ?? null,
        country_usa: payload?.serviceCountry_usa ?? null,
        country_canada: payload?.serviceCountry_canada ?? null,
        country_eu: payload?.serviceCountry_eu ?? null,
        country_other: payload?.serviceCountry_other ?? null,
        country_other_text: payload?.serviceCountry_other_text ?? null,
      },
      dataMaintenanceLocations: {
        country_uk: payload?.maintenanceCountry_uk ?? null,
        country_usa: payload?.maintenanceCountry_usa ?? null,
        country_canada: payload?.maintenanceCountry_canada ?? null,
        country_eu: payload?.maintenanceCountry_eu ?? null,
        country_other: payload?.maintenanceCountry_other ?? null,
        country_other_text: payload?.maintenanceCountry_other_text ?? null,
      },
      logicalSegregation: {
        utilize: payload?.utilize ?? null,
        moreInfo: payload?.moreInfo ?? null,
      },
      separateDataSetAccess: {
        dataSetAccess: payload?.dataSetAccess ?? null,
        setAccessMoreInfo: payload?.setAccessMoreInfo ?? null,
      },
      processChangeManagement: {
        changeManagement: payload?.changeManagement ?? null,
        changeManagementMoreInfo: payload?.changeManagementMoreInfo ?? null,
      }
    };
  }
}
