import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { validateAllFormFields } from '@shared/helpers/common';
import { ApiService } from '../../../common/services/api/api.service';
import { DocuSignComponent } from '../../../shared/modals/docu-sign-modal/docu-sign.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'more-details-form',
  templateUrl: './more-details-form.component.html',
  styleUrls: ['./more-details-form.component.scss'],
})
export class MoreDetailsFormComponent implements OnInit {
  @Output() goToVerifyDetails: EventEmitter<any> = new EventEmitter();
  @Output() goToBasicDetails: EventEmitter<any> = new EventEmitter();
  @Output() termsResult: EventEmitter<any> = new EventEmitter();

  @Input() accountForm: FormGroup;
  @Input() registerLoading: boolean;
  @Input() errorMessage: string;
  confirmed = false;
  get f(): any {
    return this.accountForm.controls;
  }

  constructor(private apiService: ApiService, private docuSignDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void { }

  isFieldInvalid(field): boolean {
    return (
      this.f[field].errors && (this.f[field].dirty || this.f[field].touched)
    );
  }

  submit() {
    if (this.accountForm.invalid) {
      validateAllFormFields(this.accountForm);
      return;
    }
    this.goToVerifyDetails.emit();
  }

  back() {
    this.goToBasicDetails.emit();
  }

  downloadAsPDF() {
    const url = this.apiService.getTermsURL('perYear', 'core');
    this.http.get(url, { responseType: 'blob' }).subscribe(data => {
      saveAs(data, 'contract.pdf');
    });
  }

  openDocuSign() {
    const url = this.apiService.getTermsURL('perYear', 'core');

    const ref = this.docuSignDialog.open(DocuSignComponent, {
      width: '50vw',
      height: '60vh',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: { clickToSign: false, isFromMembership: false, isFromSupplierJoin: true, url: `${url}#toolbar=0&menu=0` }
    });
    ref.afterClosed().subscribe(result => {
      this.confirmed = result.agreed;
      this.termsResult.emit(this.confirmed);
      //  this.insuranceFormGroup.patchValue({understood: true});
    });
    // this.socket.once('termsSigned', (event) => {
    //   if (ref) {
    //     ref.close();
    //   }
    // });
  }
}
