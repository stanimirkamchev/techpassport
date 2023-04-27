import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpService } from '@shared/pop-up-service';
import { Alert } from '../../dashboard/types/alerts.type';

@Component({
  selector: 'alerts-modal',
  templateUrl: './alerts-modal.component.html',
  styleUrls: ['./alerts-modal.component.scss']
})
export class AlertsModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private popUpService: PopUpService,
    public dialogRef: MatDialogRef<AlertsModalComponent>,
  ) {
    if (data) {
      if (data.oldest && data.oldest.length > 0) {
        const ndaAlerts = data.oldest.filter(a => a.type !== 'requestinfo');
        const requestAlerts = data.oldest.filter(a => a.type === 'requestinfo');
        this.oldest = [...new Map(ndaAlerts.map(item => [item.productID, item])).values()];
        this.oldest = [...requestAlerts, ...this.oldest];
      }

      if (data.newest && data.newest.length > 0) {
        const ndaAlerts = data.newest.filter(a => a.type !== 'requestinfo');
        const requestAlerts = data.newest.filter(a => a.type === 'requestinfo');
        this.newest = [...new Map(ndaAlerts.map(item => [item.productID, item])).values()];
        this.newest = [...requestAlerts, ...this.newest];
      }
    }
  }

  newest: Alert[] = [];
  oldest: Alert[] = [];

  ngOnInit(): void { }

  exit() {
    this.dialogRef.close();
  }

  viewConnections() {
    this.exit();
    this.popUpService.attachData({ success: true, items: ['poc'] });
  }
}
