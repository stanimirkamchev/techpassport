import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveWatchlistModalComponent } from '../leave-watchlist-modal/leave-watchlist-modal.component';
import { DeleteWatchlistModalComponent } from '../delete-watchlist-modal/delete-watchlist-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'edit-watchlist-modal',
  templateUrl: './edit-watchlist-modal.component.html',
  styleUrls: ['./edit-watchlist-modal.component.scss']
})
export class EditWatchlistModalComponent implements OnInit {
  currentMember = '';

  @Output() refresh = new EventEmitter();
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  collaborators: { id: string, email: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditWatchlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.currentMember = this.data.watchlist.currentMember;

    this.formGroup.setValue({ name: this.data.watchlist.name });
    this.collaborators = this.data.watchlist.collaborators ? this.data.watchlist.collaborators.map((item) => ({
      id: item._id,
      email: item.email,
    })) : [];
  }

  cancel() {
    this.dialogRef.close();
  }

  openLeaveModal(id: string) {
    const ref = this.dialog.open(LeaveWatchlistModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: {
        watchlist: this.data.watchlist,
        collaboratorId: id,
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'success') {
        this.refresh.emit();
      }
    });

    this.dialogRef.close();
  }

  openDeleteModal() {
    this.dialogRef.close();
    const ref = this.dialog.open(DeleteWatchlistModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: {
        watchlist: this.data.watchlist,
      }
    });
    ref.afterClosed().subscribe((res) => {
      if (res === 'success') {
        this.refresh.emit();
      }
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  isFieldInvalid(field): boolean {
    return this.f[field].errors && (this.f[field].dirty || this.f[field].touched);
  }

  onSave() {
    const values = this.formGroup.getRawValue();

    this.apiService.updateWatchlist(this.data.watchlist._id, values).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }
}
