import * as Interface from './index';

export interface IErq {
  certification: Interface.ICertification;
  breachNotification: Interface.IBreachNotification;
  ssdlc: Interface.ISsdlc;
  applicationSecurity: Interface.IApplicationSecurity;
  deletionRetention: Interface.IDeletionRetention;
  privacy: Interface.IPrivacy;
  storageSeparation: Interface.IStorageSeparation;
  recovery: Interface.IRecovery;
  encryption: Interface.IEncryption;
}

export enum ErqType {
  Certification = 'certification',
  BreachNotification = 'breachNotification',
  Ssdlc = 'ssdlc',
  ApplicationSecurity = 'applicationSecurity',
  DeletionRetention = 'deletionRetention',
  Privacy = 'privacy',
  StorageSeparation = 'storageSeparation',
  Recovery = 'recovery',
  Encryption = 'encryption'
}
