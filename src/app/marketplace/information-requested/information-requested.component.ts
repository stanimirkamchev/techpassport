import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'information-requested',
  templateUrl: './information-requested.component.html',
  styleUrls: ['./information-requested.component.scss']
})
export class InformationRequestedComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InformationRequestedComponent>,
    private apiService: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) { }

  ngOnInit(): void {
    this.apiService.postRequestInfo(this.data).subscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  backToMarketplace() {
    this.router.navigateByUrl('portal?page=market');
    this.cancel();
  }

  goToDashboard() {
    this.router.navigateByUrl('portal?page=dashboard');
    this.cancel();
  }
}
