import { Component, Input, OnInit } from '@angular/core';
import { InvitationStatus, InviteSuppliersTableModel } from '../invite-suppliers.model';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import * as inviteSuppliersSelectors from '../store/index.selector';
import { PaginatorService } from '../services/paginator.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestUpdateModalComponent } from '../request-update-modal/request-update-modal.component';
import { TppNoteModalComponent } from '../tpp-note-modal/tpp-note-modal.component';
import * as inviteSuppliersActions from '../store/index.actions';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'invitation-table',
  templateUrl: './invitation-table.component.html',
  styleUrls: ['./invitation-table.component.scss']
})
export class InvitationTableComponent implements OnInit {

  @Input() loading: Observable<boolean>;

  dataSource = new MatTableDataSource<InviteSuppliersTableModel>();
  invitations: InviteSuppliersTableModel[] = [];
  today = new Date();
  displayedColumns = [
    'user',
    'supplierInvited',
    'dateInvited',
    'status',
    'dateOnboarded',
    'userNote',
    'tppNote',
    'action'
  ];
  InvitationStatus = InvitationStatus;
  type: string;

  constructor(
    private store: Store,
    private paginatorService: PaginatorService,
    private inviteDialog: MatDialog,
    private apiService: ApiService
  ) {
    this.type = this.apiService.sessionObject.type;
  }

  ngOnInit(): void {
    this.store.select(inviteSuppliersSelectors.selectData).subscribe(invitations => {
      this.dataSource = new MatTableDataSource<InviteSuppliersTableModel>(invitations);
      this.invitations = invitations;
      this.dataSource.data = invitations;
      this.paginatorService.setPagination({ total: invitations.length, dataCount: invitations.length });
    });

    this.paginatorService.paginationOverview.subscribe(() => {
      this.dataSource.data = [...this.invitations.slice(...this.paginatorService.sliceFunc())];
    });
  }

  updateNote(element: InviteSuppliersTableModel, mode: string) {
    const ref = this.inviteDialog.open(TppNoteModalComponent, {
      width: '728px',
      height: 'auto',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: { invitationId: element._id, tppNote: element.tppNote, mode },
    });
    ref.afterClosed().subscribe((result) => { });
  }

  requestUpdate(element: InviteSuppliersTableModel) {
    const ref = this.inviteDialog.open(RequestUpdateModalComponent, {
      width: '728px',
      height: 'auto',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: { invitationId: element._id },
    });
    ref.afterClosed().subscribe((result) => { });
  }

  isDisabledRequest(element: InviteSuppliersTableModel) {
    if (!element.requestUpdateDate) {
      return false;
    }
    return new Date(element.requestUpdateDate).getTime() >= this.today.getTime();
  }

  onSelectionChange(event: any, element: InviteSuppliersTableModel) {
    this.store.dispatch(inviteSuppliersActions.setStatus({ element, status: event.value }));
  }
}
