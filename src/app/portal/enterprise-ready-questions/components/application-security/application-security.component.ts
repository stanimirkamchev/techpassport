import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-application-security',
  templateUrl: './application-security.component.html',
  styleUrls: ['./application-security.component.scss']
})
export class ApplicationSecurityComponent implements OnInit {
  formGroup: FormGroup;
  otherAuthenticationMethodInputIsVisible$ = of(false);
  otherEncryptionMethodInputIsVisible$ = of(false);

  authenticationMethods: IMultiCheckboxOption[] = [
    { label: 'SAML / OIDC SSO', selected: true, name: 'saml_oidc_sso', disabled: false },
    { label: 'Password + source IP validation', selected: false, name: 'password_source_ip_validation', disabled: false },
    { label: 'Password + source IP validation with API', selected: false, name: 'password_source_ip_validation_api', disabled: false },
    { label: 'Other', selected: true, name: 'other', disabled: false },
    { label: 'None', selected: false, name: 'none', disabled: false },
  ];
  encryptionMethodOptions: IMultiCheckboxOption[] = [
    { label: 'AES-128/192/256', selected: true, name: 'aes_128_192_256', disabled: false },
    { label: 'SHA-256/384/512 with salt', selected: false, name: 'sha_256_384_512', disabled: false },
    { label: 'Argon2/PBKDF2', selected: false, name: 'argon_pbkdf2', disabled: false },
    { label: 'Other', selected: true, name: 'other', disabled: false },
    { label: 'None', selected: false, name: 'none', disabled: false },
  ];

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  authenticationMethodsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const checked = $event.checked;

    if (source === 'none') {
      this.formGroup.controls.authenticationMethods.get('saml_oidc_sso').setValue(false);
      this.formGroup.controls.authenticationMethods.get('password_source_ip_validation').setValue(false);
      this.formGroup.controls.authenticationMethods.get('password_source_ip_validation_api').setValue(false);
      this.formGroup.controls.authenticationMethods.get('other').setValue(false);
      this.formGroup.controls.authenticationMethods.get('otherName').setValue('');
      this.otherAuthenticationMethodInputIsVisible$ = of(false);
    }
    else if (source === 'other' && checked) {
      this.otherAuthenticationMethodInputIsVisible$ = of(true);
      this.formGroup.controls.authenticationMethods.get('none').setValue(false);
    }
    else if (source === 'other' && !checked) {
      this.otherAuthenticationMethodInputIsVisible$ = of(false);
    }
    else {
      this.formGroup.controls.authenticationMethods.get('none').setValue(false);
    }
  }

  onEncryptionMethodChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const checked = $event.checked;

    if (source === 'none') {
      this.formGroup.controls.encryptionMethodOptions.get('aes_128_192_256').setValue(null);
      this.formGroup.controls.encryptionMethodOptions.get('sha_256_384_512').setValue(null);
      this.formGroup.controls.encryptionMethodOptions.get('argon_pbkdf2').setValue(null);
      this.formGroup.controls.encryptionMethodOptions.get('other').setValue(null);
      this.formGroup.controls.encryptionMethodOptions.get('otherName').setValue(null);
      this.otherEncryptionMethodInputIsVisible$ = of(false);
    }
    else if (source === 'other' && checked) {
      this.otherEncryptionMethodInputIsVisible$ = of(true);
      this.formGroup.controls.encryptionMethodOptions.get('none').setValue(null);
    }
    else if (source === 'other' && !checked) {
      this.otherEncryptionMethodInputIsVisible$ = of(false);
    }
    else {
      this.formGroup.controls.encryptionMethodOptions.get('none').setValue(null);
    }
  }
}
