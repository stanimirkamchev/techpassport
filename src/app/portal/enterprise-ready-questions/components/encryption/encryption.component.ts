import { Component, OnInit } from '@angular/core';
import { ISelectorOption } from '@shared/models/ISelectorOption';
import { MultiCheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { ControlContainer, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})
export class EncryptionComponent implements OnInit {
  formGroup: FormGroup;
  yesNoOptions = MultiCheckboxOptions.yesNoOptions;
  digitalSignatureValueCheck = false;
  allEncryptionKeysUsedValueCheck = false;

  digitalSignatureOptions: ISelectorOption[] = [
    { label: 'DSA-2048', value: 'DSA-2048' },
    { label: 'DSA-3072', value: 'DSA-3072' },
    { label: 'RSA-2048', value: 'RSA-2048' },
    { label: 'RSA-3072', value: 'RSA-3072' },
    { label: 'RSA-4096', value: 'RSA-4096' },
    { label: 'ECDSA-224', value: 'ECDSA-224' },
    { label: 'ECDSA-256', value: 'ECDSA-256' },
    { label: 'ECDSA-384', value: 'ECDSA-384' },
    { label: 'ECDSA-521', value: 'ECDSA-521' },
    { label: 'Other', value: 'Other' },
  ];

  constructor(
    public controlContainer: ControlContainer,
  ) { }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  onDigitalSignatureValueChange($event: any) {
    this.formGroup.get('digitalSignature').setValue($event);
    this.digitalSignatureValueCheck = $event;
    if (!$event) {
      this.formGroup.get('encryptionMethod').setValue(null);
    }
  }

  digitalSignatureValue() {
    return this.formGroup.get('digitalSignature').value;
  }

  allEncryptionKeysUsedValue() {
    return this.formGroup.get('allEncryptionKeysUsed').value;
  }

  onAllEncryptionKeysUsedValueChange($event: any) {
    this.formGroup.get('allEncryptionKeysUsed').setValue($event);
    this.allEncryptionKeysUsedValueCheck = $event;
  }

  areEncryptionKeysRotatedValue() {
    return this.formGroup.get('encryptionKeyRotation').value;
  }

  onEncryptionKeysRotatedValueChange($event: any) {
    this.formGroup.get('encryptionKeyRotation').setValue($event);
  }

  onEncryptionKeysUsedInConjunctionValueChange($event: any) {
    this.formGroup.get('allEncryptionKeysUsedInConjunction').setValue($event);
  }

  allEncryptionKeysUsedInConjunctionValue() {
    return this.formGroup.get('allEncryptionKeysUsedInConjunction').value;
  }

  onCryptographicControlsChange($event: MatCheckboxChange) {
    const source = $event.source.name;
    const value = $event.checked;
    const formControl = this.formGroup.controls.cryptographicControls as FormGroup;

    switch (source) {
      case 'yes':
        formControl.controls.no.setValue(null);
        break;
      case 'no':
        formControl.controls.yes.setValue(null);
        break;
    }
  }
}
