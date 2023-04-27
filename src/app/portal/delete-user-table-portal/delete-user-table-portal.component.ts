import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'delete-user-table-portal',
  templateUrl: './delete-user-table-portal.component.html',
  styleUrls: ['./delete-user-table-portal.component.scss']
})
export class DeleteUserTablePortalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DeleteUserTablePortalComponent>,
    public apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  name = ''

  ngOnInit(): void {
    if(this.data) {
      this.name = this.data.payload.name || this.data.payload.type || this.data.name
    }
  }

  remove() {
    this.apiService.adminDeleteTable(this.data.type, this.data.payload).subscribe(
      (data: HttpResponse<Object>) => {
        this.dialogRef.close(true);
      },
    );
  }

  exit() {
    this.dialogRef.close(false);
  }

}
