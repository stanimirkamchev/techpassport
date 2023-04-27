import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IInviteUser, Option } from '../../interfaces';
import { ApiService } from '@services/api/api.service';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './invite-users.component.html',
  selector: 'onboarding-invite-users',
  styleUrls: ['./invite-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteUsersComponent extends Destroyable implements OnInit {
  users: IInviteUser[] = [];
  loading = false;
  removingId = '';
  emailError = {
    isError: false,
    errorText: '',
    wrongEmail: ''
  };

  public roles: Option[] = [
    {
      label: 'Admin',
      value: 'admin'
    },
    {
      label: 'Member',
      value: 'member'
    },
    // {
    //   label: 'None',
    //   value: 'none'
    // },
  ];

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  });

  constructor(
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.getSupplierMembers();
    this.formGroup.valueChanges.subscribe(vals => {
      if (this.emailError.isError && (vals.email !== this.emailError.wrongEmail || !vals.email)) {
        this.emailError.errorText = '';
        this.emailError.isError = false;
        this.emailError.wrongEmail = '';
      }
    });
  }

  public getSupplierMembers() {
    this.apiService.getSupplierTeam().subscribe(res => {
      this.users = res.body;
      this.cdRef.detectChanges();
    });
  }
  public addUser() {
    if (this.formGroup.invalid) { return; }
    const value = this.formGroup.getRawValue();
    this.loading = true;
    this.emailError.errorText = '';
    this.emailError.isError = false;
    this.emailError.wrongEmail = value.email;
    this.apiService.addTeamMembers([value]).subscribe(data => {
      this.loading = false;
      this.removingId = '';
      this.getSupplierMembers();
      this.formGroup.reset();
      this.snackBar.open('', 'Successfully added!', {
        duration: 2000,
        panelClass: 'snckbar'
      });

      this.emailError.wrongEmail = '';
    }, (error) => {
      this.emailError.errorText = error.error.message;
      this.emailError.isError = true;
      this.loading = false;
      this.removingId = '';
      this.snackBar.open('', 'Something went wrong. Please try again!', {
        duration: 2000,
        panelClass: 'snckbar'
      });
      this.cdRef.detectChanges();
    });
  }

  public removeUser(id: string) {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Are you sure, this cannot be undone.'
      },
      width: '250px',
    } as any).afterClosed().subscribe(res => {
      if (res) {
        this.removingId = id;
        this.cdRef.detectChanges();
        this.apiService.supplierTeamRemove(id).subscribe(() => {
          this.removingId = '';
          this.getSupplierMembers();
          this.snackBar.open('', 'Successfully removed!', {
            duration: 2000,
            panelClass: 'snckbar'
          });
        }, (error) => {
          this.removingId = '';
          this.cdRef.detectChanges();
          this.snackBar.open('', 'Something went wrong. Please try again!', {
            duration: 2000,
            panelClass: 'snckbar'
          });
        });
      }
    });
  }
}
