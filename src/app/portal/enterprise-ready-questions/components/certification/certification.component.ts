import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Destroyable } from '@abstract/destroyable';
import { ApiService } from '@services/api/api.service';
import * as uuid from 'uuid';
import { ErqType } from '../../models/erq';
import { ICertification } from '../../models';

type ApiPayload = { type: string, field: string, data: any };

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificationComponent extends Destroyable implements OnInit {

  cerfificationFileState = Array(4).fill(0).map(t => ({
    error: '',
    isSaving: false,
    isRemoving: false,
    fid: uuid(),
    uploadStatus: ''
  }));

  isNone = false;

  question1Value = {
    soc2: null,
    iso27001: null,
    other: null,
    none: null,
  };

  constructor(
    public controlContainer: ControlContainer,
    public ref: ChangeDetectorRef,
    private apiService: ApiService
  ) {
    super();
  }

  get qOneFilled(): boolean {
    return !!this.question1Value.iso27001 || !!this.question1Value.soc2 || !!this.question1Value.other;
  }

  formGroup: FormGroup = null;
  accreditationItems: IMultiCheckboxOption[] = [
    { label: 'SOC2', name: 'soc2', selected: false, disabled: false },
    { label: 'ISO27001', name: 'iso27001', selected: false, disabled: false },
    { label: 'Other', name: 'other', selected: false, disabled: false },
    { label: 'None', name: 'none', selected: false, disabled: false },
  ];

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
    this.question1Value = this.formGroup.controls.currentAccreditations.value;
    if (this.formGroup.value.soc2Certificate.socFileInfo) {
      this.cerfificationFileState[1].fid = this.formGroup.value.soc2Certificate.socFileInfo.fid;
    }

    if (this.formGroup.value.iso27001Certificate.isoFileInfo) {
      this.cerfificationFileState[2].fid = this.formGroup.value.otherCertificate.isoFileInfo.fid;
    }

    if (this.formGroup.value.otherCertificate.otherFileInfo) {
      this.cerfificationFileState[3].fid = this.formGroup.value.otherCertificate.otherFileInfo.fid;
    }


    this.formGroup.valueChanges.subscribe((values: ICertification) => {
    });
  }

  // ================== FIRST OPTION ========================
  onCurrentAccreditationValueChange($event: MatCheckboxChange) {
    this.question1Value = this.formGroup.controls.currentAccreditations.value;
    const source = $event.source.name;
    // Q1 FORM
    if (source === 'none' && this.question1Value.none) {
      // Q1 FORM
      this.formGroup.controls.currentAccreditations.get('soc2').setValue(null);
      this.formGroup.controls.currentAccreditations.get('iso27001').setValue(null);
      this.formGroup.controls.currentAccreditations.get('other').setValue(null);

      // Q2 FORM
      this.formGroup.get(['soc2Certificate', 'socUpToDate']).setValue(null);
      // Q3 FORM
      this.formGroup.get(['soc2Certificate', 'socFileInfo']).setValue(null);
      // Q4 FORM
      this.formGroup.get(['soc2Certificate', 'socRenewalDate']).setValue(null);
      // Q5 FORM
      this.formGroup.get(['soc2Certificate', 'socPlansToObtain']).setValue(null);
      // Q6 FORM
      this.formGroup.get(['soc2Certificate', 'socExpectedDate']).setValue(null);

      // Q7 FORM
      this.formGroup.get(['iso27001Certificate', 'isoUpToDate']).setValue(null);
      // Q8 FORM
      this.formGroup.get(['iso27001Certificate', 'isoFileInfo']).setValue(null);
      // Q9 FORM
      this.formGroup.get(['iso27001Certificate', 'isoRenewalDate']).setValue(null);
      // Q10 FORM
      this.formGroup.get(['iso27001Certificate', 'isoPlansToObtain']).setValue(null);
      // Q11 FORM
      this.formGroup.get(['iso27001Certificate', 'isoExpectedDate']).setValue(null);

      // Q12 FORM
      this.formGroup.get(['otherCertificate', 'name']).setValue(null);
      // Q13 FORM
      this.formGroup.get(['otherCertificate', 'otherUpToDate']).setValue(null);
      // Q14 FORM
      this.formGroup.get(['otherCertificate', 'otherFileInfo']).setValue(null);
      // Q15 FORM
      this.formGroup.get(['otherCertificate', 'otherRenewalDate']).setValue(null);
      // Q16 FORM
      this.formGroup.get(['otherCertificate', 'otherPlansToObtain']).setValue(null);
      // Q17 FORM
      this.formGroup.get(['otherCertificate', 'otherExpectedDate']).setValue(null);

      this.question1Value.soc2 = null;
      this.question1Value.iso27001 = null;
      this.question1Value.other = null;
    } else {
      this.question1Value.none = null;
      // Q1 FORM
      this.formGroup.controls.currentAccreditations.get('none').setValue(null);
    }
  }
  // ================== FIRST OPTION END ========================

  // ============== SOC 2 =================
  onSoc2UpToDateChange($event: any) {
    this.formGroup.get(['soc2Certificate', 'socUpToDate']).setValue($event);
    if ($event) {
      this.formGroup.get(['soc2Certificate', 'socPlansToObtain']).setValue(null);
      this.formGroup.get(['soc2Certificate', 'socExpectedDate']).setValue(null);
      if (!this.formGroup.get(['soc2Certificate', 'socRenewalDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['soc2Certificate', 'socRenewalDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['soc2Certificate', 'socFileInfo']).setValue(null);
      this.formGroup.get(['soc2Certificate', 'socRenewalDate']).setValue(null);
    }
    this.ref.detectChanges();
  }

  onSOCPlansToObtainChange($event: any) {
    this.formGroup.get(['soc2Certificate', 'socPlansToObtain']).setValue($event);
    if ($event) {
      this.formGroup.get(['soc2Certificate', 'socFileInfo']).setValue(null);
      this.formGroup.get(['soc2Certificate', 'socRenewalDate']).setValue(null);
      if (!this.formGroup.get(['soc2Certificate', 'socExpectedDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['soc2Certificate', 'socExpectedDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['soc2Certificate', 'socExpectedDate']).setValue(null);
    }
    this.ref.detectChanges();
  }
  // // ============== SOC 2 END =================

  // // ============== ISO 27001 =================
  onIsoUpToDateChange($event: any) {
    this.formGroup.get(['iso27001Certificate', 'isoUpToDate']).setValue($event);
    if ($event) {
      this.formGroup.get(['iso27001Certificate', 'isoPlansToObtain']).setValue(null);
      this.formGroup.get(['iso27001Certificate', 'isoExpectedDate']).setValue(null);
      if (!this.formGroup.get(['iso27001Certificate', 'isoRenewalDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['iso27001Certificate', 'isoRenewalDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['iso27001Certificate', 'isoFileInfo']).setValue(null);
      this.formGroup.get(['iso27001Certificate', 'isoRenewalDate']).setValue(null);
    }
    this.ref.detectChanges();
  }

  onIsoPlansToObtainChange($event: any) {
    this.formGroup.get(['iso27001Certificate', 'isoPlansToObtain']).setValue($event);
    if ($event) {
      this.formGroup.get(['iso27001Certificate', 'isoFileInfo']).setValue(null);
      this.formGroup.get(['iso27001Certificate', 'isoRenewalDate']).setValue(null);
      if (!this.formGroup.get(['iso27001Certificate', 'isoExpectedDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['iso27001Certificate', 'isoExpectedDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['iso27001Certificate', 'isoExpectedDate']).setValue(null);
    }
    this.ref.detectChanges();
  }
  // // ============== ISO 27001 END =================

  // // ============== OTHER =================
  onOtherUpToDateChange($event: any) {
    this.formGroup.get(['otherCertificate', 'otherUpToDate']).setValue($event);
    if ($event) {
      this.formGroup.get(['otherCertificate', 'otherPlansToObtain']).setValue(null);
      this.formGroup.get(['otherCertificate', 'otherExpectedDate']).setValue(null);
      if (!this.formGroup.get(['otherCertificate', 'otherRenewalDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['otherCertificate', 'otherRenewalDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['otherCertificate', 'otherFileInfo']).setValue(null);
      this.formGroup.get(['otherCertificate', 'otherRenewalDate']).setValue(null);
    }
    this.ref.detectChanges();
  }

  onOtherPlansToObtainChange($event: any) {
    this.formGroup.get(['otherCertificate', 'otherPlansToObtain']).setValue($event);
    if ($event) {
      this.formGroup.get(['otherCertificate', 'otherFileInfo']).setValue(null);
      this.formGroup.get(['otherCertificate', 'otherRenewalDate']).setValue(null);
      if (!this.formGroup.get(['otherCertificate', 'otherExpectedDate']).value) {
        const date = new Date();
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.formGroup.get(['otherCertificate', 'otherExpectedDate']).setValue(newDate);
      }
    } else {
      this.formGroup.get(['otherCertificate', 'otherExpectedDate']).setValue(null);
    }
    this.ref.detectChanges();
  }
  // ============== OTHER END =================

  // FILE FUNCTIONALITY
  onSave(file: any, index: number, group: string[]) {
    if (this.cerfificationFileState[index].isRemoving || this.cerfificationFileState[index].isSaving) { return; }
    this.cerfificationFileState[index].isSaving = true;
    const fileObj = this.getFileObj(this.formGroup.value, group);
    const fileName = fileObj.name;

    const payload: ApiPayload = {
      type: `${ErqType.Certification}/${group[0]}`,
      field: group[1],
      data: {
        file,
        fileName,
        fid: this.cerfificationFileState[index].fid
      }
    };
    this.apiCall(payload, index, group[0]);
  }

  onRemove(index: number, group: string[]) {
    if (this.cerfificationFileState[index].isRemoving || this.cerfificationFileState[index].isSaving) { return; }
    this.cerfificationFileState[index].isRemoving = true;

    const payload: ApiPayload = {
      type: `${ErqType.Certification}/${group[0]}`,
      field: group[1],
      data: {
        file: undefined,
        fileName: null,
        fid: this.cerfificationFileState[index].fid
      }
    };
    this.apiCall(payload, index, group[0]);
  }

  onDownload(index: number, group: string[]) {
    const fileObj = this.getFileObj(this.formGroup.value, group);
    const key = fileObj.file;

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.apiService.getFileUrl(key);
    a.download = key;
    a.click();
  }

  private getFileObj(val: any, group: string[]) {
    if (group.length === 2) { return val[group[0]][group[1]]; }
    else { return val[group[0]]; }
  }

  // API

  private apiCall(payload: ApiPayload, index: number, group: string) {
    this.apiService.saveFileErq(payload.type, payload.field, payload.data).subscribe(res => {
      this.cerfificationFileState[index].isSaving = false;
      this.cerfificationFileState[index].isRemoving = false;
      this.cerfificationFileState[index].error = '';
      this.cerfificationFileState[index].uploadStatus = '';
      this.formGroup.get([group, payload.field]).setValue(payload.data.fileName ? res.body : null);
      this.ref.detectChanges();
    }, err => {
      this.cerfificationFileState[index].isSaving = false;
      this.cerfificationFileState[index].isRemoving = false;
      this.cerfificationFileState[index].error = err.error.message;
      this.ref.detectChanges();
    });
  }

}
