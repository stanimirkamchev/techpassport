import { ErqBase } from './erq-base';
import { ICertificationDTO } from './erq-dto';

export interface CurrentAccreditationsCertification {
  soc2: boolean;
  iso27001: boolean;
  other: boolean;
  none: boolean | null;
}

export interface Soc2CertificateCertification {
  socUpToDate: boolean;
  socFileInfo: boolean;
  socRenewalDate: Date | string | null;
  socPlansToObtain: boolean | null;
  socExpectedDate: Date | string | null;
}

export interface Iso27001CertificateCertification {
  isoUpToDate: boolean;
  isoFileInfo: any | string | null;
  isoRenewalDate: Date | string | null;
  isoPlansToObtain: boolean | null;
  isoExpectedDate: Date | string | null;
}

export interface OtherCertificateCertification {
  name: string | null;
  otherUpToDate: boolean;
  otherFileInfo: any | string | null;
  otherRenewalDate: Date | string | null;
  otherPlansToObtain: boolean | null;
  otherExpectedDate: Date | string | null;
}

export interface ICertification {
  currentAccreditations: CurrentAccreditationsCertification;
  soc2Certificate: Soc2CertificateCertification;
  iso27001Certificate: Iso27001CertificateCertification;
  otherCertificate: OtherCertificateCertification;
}

export class Certification extends ErqBase<ICertification> {

  constructor(payload: ICertificationDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: ICertificationDTO): void {
    this.values = {
      currentAccreditations: {
        soc2: payload?.soc2 ?? null,
        iso27001: payload?.iso27001 ?? null,
        other: payload?.other ?? null,
        none: payload?.none ?? null
      },
      soc2Certificate: {
        socUpToDate: payload?.socUpToDate ?? null,
        socFileInfo: payload?.socFileInfo ?? null,
        socRenewalDate: payload?.socRenewalDate ?? null,
        socPlansToObtain: payload?.socPlansToObtain ?? null,
        socExpectedDate: payload?.socExpectedDate ?? null,

      },
      iso27001Certificate: {
        isoUpToDate: payload?.isoUpToDate ?? null,
        isoFileInfo: payload?.isoFileInfo ?? null,
        isoRenewalDate: payload?.isoRenewalDate ?? null,
        isoPlansToObtain: payload?.plansToObtain ?? null,
        isoExpectedDate: payload?.expectedDate ?? null
      },
      otherCertificate: {
        name: payload?.name ?? null,
        otherUpToDate: payload?.otherUpToDate ?? null,
        otherFileInfo: payload?.otherFileInfo ?? null,
        otherRenewalDate: payload?.otherRenewalDate ?? null,
        otherPlansToObtain: payload?.otherPlansToObtain ?? null,
        otherExpectedDate: payload?.otherExpectedDate ?? null,
      },
    };
  }
}
