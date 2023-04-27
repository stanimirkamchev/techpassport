import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '@services/api/api.service';


interface TeamMember {
  _id?: string;
  name: string;
  email: string;
  role: string;
  pocNotices: boolean;
  businessGroup: string;
  isSamlAuthenticated?: boolean;
  isCurrentUserSamlAuthenticated?: boolean;
}

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})

export class AddTeamMemberComponent implements OnInit {
  teamFormGroup: FormGroup;
  requestInProgress = false;
  message = '';
  success = false;
  members: Array<TeamMember> = [];
  editMode = false;
  businessGroups: Array<any>;
  level: number;

  // domain: string;
  constructor(
    private dialogRef: MatDialogRef<AddTeamMemberComponent>,
    private fb: FormBuilder,
    public apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    let initialGroup;
    this.level = data.level;
    if (apiService.sessionObject.type === 'customer') {
      initialGroup = 'requestor';
      this.teamFormGroup = fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        role: new FormControl(initialGroup, Validators.minLength(2)),
        businessGroup: new FormControl('', [Validators.required, Validators.minLength(2)]),
        entity: new FormControl('', [Validators.required, Validators.minLength(2)]),
        pocNotices: new FormControl(''),
        isSamlAuthenticated: new FormControl(false)
      });

      if (data.member) {
        // console.log(data)
        this.editMode = true;
        const entID = data.businessGroups.find(x => x._id === data.member.businessGroupID)?.entityID;
        this.entChanged({ value: entID });
        this.teamFormGroup.patchValue({
          email: data.member.email,
          name: data.member.name,
          role: data.member.group,
          businessGroup: data.member.businessGroupID,
          entity: entID,
          isSamlAuthenticated: data.member.isSamlAuthenticated
        });
      }

    } else {
      initialGroup = 'member';

      this.teamFormGroup = fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        role: new FormControl(initialGroup, Validators.minLength(2)),
        businessGroup: new FormControl(''),
        pocNotices: new FormControl(''),
        isSamlAuthenticated: new FormControl(false)
      });
    }

    // this.domain = apiService.sessionObject.domain;
  }

  ngOnInit() {
  }

  entChanged(event) {
    this.teamFormGroup.patchValue({ businessGroup: null });
    this.businessGroups = this.data.businessGroups.filter(x => x.entityID === event.value);
  }

  getNumber() {
    let n = this.members.length;
    if (this.teamFormGroup.valid) {
      n++;
    }
    return n;
  }

  addMember(reset: boolean) {
    const tm: TeamMember = {
      name: this.teamFormGroup.value.name,
      email: this.teamFormGroup.value.email,
      role: this.teamFormGroup.value.role,
      pocNotices: this.teamFormGroup.value.pocNotices,
      businessGroup: this.teamFormGroup.value.businessGroup,
      isSamlAuthenticated: this.teamFormGroup.value.isSamlAuthenticated
    };

    const has = this.members.find(x => x.email === tm.email);
    if (!has) {
      this.members.splice(0, 0, tm);
    }
    if (reset) {
      this.resetForm();
    }

  }

  resetForm() {
    this.teamFormGroup.reset({ role: 'member' });
  }

  async confirm() {
    let tm: TeamMember;
    if (this.teamFormGroup.valid) {
      tm = {
        name: this.teamFormGroup.value.name,
        email: this.teamFormGroup.value.email,
        role: this.teamFormGroup.value.role,
        pocNotices: this.teamFormGroup.value.pocNotices,
        businessGroup: this.teamFormGroup.value.businessGroup,
        isSamlAuthenticated: this.teamFormGroup.value.isSamlAuthenticated
      };
    } else {
      return;
    }
    this.members = [tm];
    this.message = '';
    this.requestInProgress = true;
    let action;
    let payload;
    if (this.editMode) {
      action = 'updateTeamMember';
      tm._id = this.data.member._id;
      payload = tm;
    } else {
      action = 'addTeamMembers';
      payload = this.members;
    }

    this.apiService[action](payload).subscribe(
      (data: HttpResponse<Object>) => {
        this.message = 'Success';
        this.success = true;
        this.requestInProgress = false;
        this.dialogRef.close();
        this.resetForm();
      },
      (respError: Error) => {
        this.success = false;
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message;
        }
        this.requestInProgress = false;
      }
    );

  }
  exit() {
    this.dialogRef.close();
  }

}
