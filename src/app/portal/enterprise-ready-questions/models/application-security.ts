import { ErqBase } from './erq-base';
import { IApplicationSecurityDTO } from './erq-dto';

export interface AuthenticationMethods {
  saml_oidc_sso: boolean;
  password_source_ip_validation: boolean;
  password_source_ip_validation_api: boolean;
  other: boolean;
  none: boolean;
  otherName: string | null;
}

export interface EncryptionMethodOptions {
  aes_128_192_256: boolean;
  sha_256_384_512: boolean;
  argon_pbkdf2: boolean;
  other: boolean;
  none: boolean;
  otherName: string | null;
}

export interface IApplicationSecurity {
  authenticationMethods: AuthenticationMethods;
  encryptionMethodOptions: EncryptionMethodOptions;
}

export class ApplicationSecurity extends ErqBase<IApplicationSecurity> {

  constructor(payload: IApplicationSecurityDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IApplicationSecurityDTO): void {
    this.values = {
      authenticationMethods: {
        saml_oidc_sso: payload?.saml_oidc_sso ?? null,
        password_source_ip_validation: payload?.password_source_ip_validation ?? null,
        password_source_ip_validation_api: payload?.password_source_ip_validation_api ?? null,
        other: payload?.authOther ?? null,
        none: payload?.authNone ?? null,
        otherName: payload?.authOtherName ?? null,
      },
      encryptionMethodOptions: {
        aes_128_192_256: payload?.aes_128_192_256 ?? null,
        sha_256_384_512: payload?.sha_256_384_512 ?? null,
        argon_pbkdf2: payload?.argon_pbkdf2 ?? null,
        other: payload?.encriptOther ?? null,
        none: payload?.encriptNone ?? null,
        otherName: payload?.encriptOtherName ?? null,
      }
    };
  }
}
