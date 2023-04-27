import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Destroyable } from '@abstract/destroyable';

import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';
import { FormTracker } from '../form-tracker';

@Component({
  templateUrl: './profile-settings.component.html',
  selector: 'profile-settings',
  styleUrls: ['./profile-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent extends Destroyable implements OnInit {
  form: FormGroup;
  loading = false;
  supplierId: string;
  onlyMandatory = false;
  updatedAt: Date;
  submitted = false;
  supplierIsInProgress: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tracker: FormTracker,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.getProfile();
    this.getSupplierDetails();
    this.form.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      if (this.form.valid && this.tracker.isValid('profileSettings')) {
        const formValue = this.form.value;
        // this.apiService.updateUserProfile(
        //   formValue.personalSettings
        // ).subscribe();
        const { auditing, employeeInsurance, publicInsurance, cyberInsurance, experience, ...data } = value.companySettings || {};

        const formData = {
          ...data,
          auditing: {
            auditRights: auditing?.auditRights ?? 'yes',
            thirdPartyAuditRights: auditing?.thirdPartyAuditRights ? 'yes' : 'no',
          },
          experience,
        };
        // console.log('profile form', formData);
        delete formData.logo;
        // this.apiService.supplierDetails(formData).subscribe();
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      personalSettings: [undefined],
      companySettings: [undefined],
      membershipSettings: [undefined],
    });
  }

  getProfile() {
    this.apiService.userProfile().subscribe((res) => {
      if (res.body) {
        const {
          name,
          firstName,
          lastName,
          email,
          role,
          jobTitle
        } = res.body;
        this.form.get('personalSettings').setValue({
          name: name || `${firstName} ${lastName}`,
          email,
          role,
          jobTitle,
        });
      }
    });
  }

  getSupplierDetails() {
    this.apiService.getSupplierDetails().subscribe((res) => {
      if (res.body) {
        this.supplierId = res.body.id;
        let {
          name,
          firstName, // legacy data
          lastName,
          country,
          companyNumber,
          incorporated,
          companyStage,
          companyWebsite,
          address1,
          address2,
          city,
          postcode,
          region,
          about,
          currency,
          revenue,
          isAward,
          details,
          competition,
          question,
          logo,
          auditing,
          // insuranceCert,
          experience,
          updatedAt,
          founderIdentify,
          boardMembersIdentify,
          founders,
          boardMembers,
          isCarbonNeutral,
          isCarbonZero,
          haveEsgExpert,
          haveEsgCommittee,
          insurance,
          diversityDocuments,
          documents,
          status
        } = res.body;

        this.supplierIsInProgress = status === 'started';

        this.updatedAt = updatedAt;
        if (auditing) {
          auditing.auditRights = auditing.auditRights === 'yes';
          auditing.thirdPartyAuditRights = auditing.thirdPartyAuditRights === 'yes';
        } else {
          auditing = {
            auditRights: 'no',
            thirdPartyAuditRights: 'no'
          };
        }

        const documentValue = {
          file1: diversityDocuments.find(t => t.index === 1)?.fileName || diversityDocuments.find(t => t.index === 1)?.file,
          key1: diversityDocuments.find(t => t.index === 1)?.file,
          name1: documents?.name1,
          file2: diversityDocuments.find(t => t.index === 2)?.fileName || diversityDocuments.find(t => t.index === 2)?.file,
          key2: diversityDocuments.find(t => t.index === 2)?.file,
          name2: documents?.name2,
          file3: diversityDocuments.find(t => t.index === 3)?.fileName || diversityDocuments.find(t => t.index === 3)?.file,
          key3: diversityDocuments.find(t => t.index === 3)?.file,
          name3: documents?.name3,
        };

        this.form.get('companySettings').setValue({
          name: name || `${firstName} ${lastName}`,
          country: country.toUpperCase(),
          companyNumber,
          incorporated,
          companyStage,
          companyWebsite,
          address1,
          address2,
          city,
          postcode,
          region,
          about,
          currency,
          revenue,
          isAward,
          details,
          competition,
          question,
          logo,
          auditing,
          experience,
          founderIdentify,
          boardMembersIdentify,
          founders,
          boardMembers,
          isCarbonNeutral,
          isCarbonZero,
          haveEsgExpert,
          haveEsgCommittee,
          insurance,
          documents: documentValue,
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid || !this.tracker.isValid('profileSettings')) {
      return;
    }

    const value = this.form.value;
    const tasks = [];
    tasks.push(this.apiService.updateUserProfile(
      value.personalSettings
    ));
    const { auditing, employeeInsurance, publicInsurance, cyberInsurance, experience, ...data } = value.companySettings;

    const formData = {
      ...data,
      auditing: {
        auditRights: auditing.auditRights ? 'yes' : 'no',
        thirdPartyAuditRights: auditing.thirdPartyAuditRights ? 'yes' : 'no',
      },
      experience,
    };

    delete formData.logo;
    tasks.push(this.apiService.supplierDetails(formData));
    tasks.push(this.apiService.supplierStatus());
    this.loading = true;
    forkJoin(tasks).subscribe(
      (_) => {
        this.loading = false;
        this.router.navigate([], {
          queryParams: { page: 'dashboard' },
          queryParamsHandling: 'merge',
          relativeTo: this.route
        });
      },
      () => {
        this.loading = false;
      }
    );
  }
}
