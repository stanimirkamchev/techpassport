import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InvitationFilter, InvitationFilterPreview, InvitationStatus, InvitationType, InvitationUserType } from '../invite-suppliers.model';
import { Store } from '@ngrx/store';
import * as inviteSuppliersSelectors from '../store/index.selector';
import { setFilter } from '../store/index.actions';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'invitation-filters',
  templateUrl: './invitation-filters.component.html',
  styleUrls: ['./invitation-filters.component.scss']
})
export class InvitationFiltersComponent implements OnInit {

  @Output() filterChange = new EventEmitter();

  formGroup = new FormGroup({
    status: new FormControl(InvitationStatus.ALL),
    type: new FormControl(InvitationType.ALL),
    userType: new FormControl(InvitationUserType.ALL),
    company: new FormControl('all'),
    emailAddress: new FormControl('all'),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    search: new FormControl(''),
  });
  InvitationStatus = InvitationStatus;
  InvitationType = InvitationType;
  InvitationUserType = InvitationUserType;
  filterPreview: InvitationFilterPreview;
  userLevel: number;
  type: string;

  constructor(
    private store: Store,
    private apiService: ApiService
  ) {
    this.userLevel = this.apiService.sessionObject.level;
    this.type = this.apiService.sessionObject.type;
  }

  ngOnInit(): void {
    this.store.select(inviteSuppliersSelectors.loadFilter).subscribe((filterPreview: InvitationFilterPreview) => {
      this.filterPreview = filterPreview;
    });

    this.formGroup.valueChanges.subscribe((filters: InvitationFilter) => {
      this.store.dispatch(setFilter({
        filter: filters
      }));
      this.filterChange.emit();
    });
  }

  resetForm() {
    this.formGroup.controls.status.setValue(InvitationStatus.ALL);
    this.formGroup.controls.type.setValue(InvitationType.ALL);
    this.formGroup.controls.userType.setValue(InvitationUserType.ALL);
    this.formGroup.controls.company.setValue('all');
    this.formGroup.controls.emailAddress.setValue('all');
    this.formGroup.controls.dateTo.setValue('');
    this.formGroup.controls.dateFrom.setValue('');
  }

  isHiddenOption(type: string, value: string) {
    if (!this.filterPreview[type]) {
      return true;
    }
    return this.filterPreview[type].find((a: string) => a === value);
  }

}
