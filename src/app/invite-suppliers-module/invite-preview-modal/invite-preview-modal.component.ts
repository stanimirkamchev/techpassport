import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as inviteSuppliersSelectors from '../store/index.selector';
import { InviteSuppliersTableModel } from '../invite-suppliers.model';
import { MatTableDataSource } from '@angular/material/table';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import * as inviteSuppliersActions from '../store/index.actions';
import { selectDataLoading } from '../store/index.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'invite-preview-modal',
  templateUrl: './invite-preview-modal.component.html',
  styleUrls: ['./invite-preview-modal.component.scss']
})
export class InvitePreviewModalComponent implements OnInit {

  dataSource = new MatTableDataSource<InviteSuppliersTableModel>();
  displayedColumns = [
    'supplierInvited',
    'dateInvited',
    'status',
  ];

  loading$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<InvitePreviewModalComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loading$ = this.store.select(selectDataLoading);
    this.store.select(inviteSuppliersSelectors.selectDataLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(inviteSuppliersActions.loadDataTable())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(inviteSuppliersSelectors.selectData)))
      .subscribe(invitations => {
        this.dataSource = new MatTableDataSource<InviteSuppliersTableModel>(invitations);
      });
  }

  exit() {
    this.dialogRef.close({ goTo: 'close' });
  }

  fullVeiw() {
    this.dialogRef.close({ goTo: 'full_page' });
  }

  inviteSupplier() {
    this.dialogRef.close({ goTo: 'invite' });
  }
}
