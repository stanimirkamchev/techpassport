export interface ICertificationDTO {
  soc2: boolean;
  iso27001: boolean;
  other: boolean;
  none: boolean | null;

  socUpToDate: boolean;
  socFileInfo: any | string | null;
  socRenewalDate: Date | string | null;
  socPlansToObtain: boolean | null;
  socExpectedDate: Date | string | null;

  isoUpToDate: boolean;
  isoFileInfo: any | string | null;
  isoRenewalDate: Date | string | null;
  plansToObtain: boolean;
  expectedDate: Date | string | null;

  name: string | null;
  otherUpToDate: boolean;
  otherFileInfo: any | string | null;
  otherRenewalDate: Date | string | null;
  otherPlansToObtain: boolean | null;
  otherExpectedDate: Date | string | null;
}

export interface IBreachNotificationDTO {
  breachNotification: boolean;
}

export interface ISsdlcDTO {
  penetrationTestCovering: boolean;
}

export interface IApplicationSecurityDTO {
  saml_oidc_sso: boolean;
  password_source_ip_validation: boolean;
  password_source_ip_validation_api: boolean;
  authOther: boolean;
  authNone: boolean;
  authOtherName: string | null;
  aes_128_192_256: boolean;
  sha_256_384_512: boolean;
  argon_pbkdf2: boolean;
  encriptOther: boolean;
  encriptNone: boolean;
  encriptOtherName: string | null;
}

export interface IDeletionRetentionDTO {
  yes: boolean;
  no: boolean;
  deleteAbility: boolean;
  provideACopy: boolean;
  currentProcessExplanationOfDeletingCustomersData: string | null;
  currentProcessExplanationOfCopyingCustomersData: string | null;
}

export interface IPrivacyDTO {
  country_uk: boolean;
  country_usa: boolean;
  country_canada: boolean;
  country_eu: boolean;
  country_none: boolean;

  legislation_uk: boolean;
  legislation_usa: boolean;
  legislation_canada: boolean;
  legislation_eu: boolean;

  gdpr: boolean;
  ccpa: boolean;
  pipeda: boolean;
  other: boolean;
  otherText: string | null;

  data_consumed_uk: boolean;
  data_consumed_usa: boolean;
  data_consumed_canada: boolean;
  data_consumed_eu: boolean;
  data_consumed_no: boolean;

  yes: boolean;
  no: boolean;
  na: boolean;
}

export interface IStorageSeparationDTO {
  serviceCountry_uk: boolean;
  serviceCountry_usa: boolean;
  serviceCountry_canada: boolean;
  serviceCountry_eu: boolean;
  serviceCountry_other: boolean;
  serviceCountry_other_text: string | null;

  maintenanceCountry_uk: boolean;
  maintenanceCountry_usa: boolean;
  maintenanceCountry_canada: boolean;
  maintenanceCountry_eu: boolean;
  maintenanceCountry_other: boolean;
  maintenanceCountry_other_text: string | null;

  utilize: boolean;
  logicalMoreInfo: string | null;

  guaranteeLocation: boolean;
  moreInfo: string | null;

  dataSetAccess: boolean;
  setAccessMoreInfo: string | null;

  changeManagement: boolean;
  changeManagementMoreInfo: string | null;
}

export interface IRecoveryDTO {
  criticality: any;
  recoveryTime: number | string;
}

export interface IEncryptionDTO {
  yes: boolean;
  no: boolean;
  na: boolean;

  digitalSignature: boolean;
  encryptionMethod: string | null;
  allEncryptionKeysUsed: boolean;
  allEncryptionKeysMoreInfo: string | null;
  encryptionKeyRotation: boolean;
  allEncryptionKeysUsedInConjunction: boolean;
}

export interface IErqDto {
  certification: ICertificationDTO;
  breachNotification: IBreachNotificationDTO;
  ssdlc: ISsdlcDTO;
  applicationSecurity: IApplicationSecurityDTO;
  deletionRetention: IDeletionRetentionDTO;
  privacy: IPrivacyDTO;
  storageSeparation: IStorageSeparationDTO;
  recovery: IRecoveryDTO;
  encryption: IEncryptionDTO;
}
