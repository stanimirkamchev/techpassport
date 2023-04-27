import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { ContactForm, TextConstants } from '@shared/text-constants';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  public contactFormGroup: FormGroup;
  public messageSent = false;
  public message = '';
  public requestInProgress = false;
  selectTheSubject = ContactForm.SelectTheSubject;
  describeTheProblem = ContactForm.DescribeTheProblem;
  sendButtonText = ContactForm.Send;
  cancelButtonText = ContactForm.Cancel;
  closeButtonText = ContactForm.Close;

  constructor(
    public dialogRef: MatDialogRef<ContactModalComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    let subject = '';
    if (data && data.subject) {
      subject = data.subject;
    }
    this.contactFormGroup = formBuilder.group({
      subject: new FormControl(subject, [Validators.minLength(1), Validators.required]),
      content: new FormControl('', [Validators.minLength(4), Validators.required]),
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  async send() {
    if (this.contactFormGroup.valid) {
      // to do submit
      this.requestInProgress = true;
      this.messageSent = true;
      this.apiService.contact(this.contactFormGroup.value).subscribe(
        (data: HttpResponse<object>) => {
          this.message = TextConstants.ContactFormMessageSent;
          this.messageSent = true;
        },
        (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
          } catch (error) {
            this.message = respError.message; // or statusText
          }
          this.requestInProgress = false;
        }
      );
    }
  }
}
