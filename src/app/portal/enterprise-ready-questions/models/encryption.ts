import { ErqBase } from './erq-base';
import { IEncryptionDTO } from './erq-dto';

export interface CryptographicControls {
  yes: boolean;
  no: boolean;
}

export interface IEncryption {
  cryptographicControls: CryptographicControls;
  digitalSignature: boolean;
  encryptionMethod: string | null;
  allEncryptionKeysUsed: boolean;
  allEncryptionKeysMoreInfo: string | null;
  encryptionKeyRotation: boolean;
  allEncryptionKeysUsedInConjunction: boolean;
}

export class Encryption extends ErqBase<IEncryption> {

  constructor(payload: IEncryptionDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload?: IEncryptionDTO): void {
    this.values = {
      cryptographicControls: {
        yes: payload?.yes ?? null,
        no: payload?.no ?? null,
      },
      digitalSignature: payload?.digitalSignature ?? null,
      encryptionMethod: payload?.encryptionMethod ?? null,
      allEncryptionKeysUsed: payload?.allEncryptionKeysUsed ?? null,
      allEncryptionKeysMoreInfo: payload?.allEncryptionKeysMoreInfo ?? null,
      encryptionKeyRotation: payload?.encryptionKeyRotation ?? null,
      allEncryptionKeysUsedInConjunction: payload?.allEncryptionKeysUsedInConjunction ?? null,
    };
  }
}
