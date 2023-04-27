import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertsModalComponent } from '../../../portal/alerts-modal/alerts-modal.component';
import { Alert } from '../../types/alerts.type';

@Component({
  selector: 'dashboard-alerts-buyer',
  templateUrl: './dashboard-alerts-buyer.component.html',
  styleUrls: ['./dashboard-alerts-buyer.component.scss']
})
export class DashboardAlertsBuyerComponent implements OnInit, OnChanges {

  constructor(
    private addDialog: MatDialog,
  ) { }

  @Input() loading: boolean;
  @Input() newest: Alert[];
  @Input() oldest: Alert[];
  @Input() viewAllToggle: boolean;

  @Output() changeViewToggleBtn = new EventEmitter<any>();

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.viewAllToggle && changes.viewAllToggle?.previousValue !== changes.viewAllToggle?.currentValue) {
      if (this.viewAllToggle) {
        this.viewAll();
      }
    }
  }

  viewAll() {
    const ref = this.addDialog.open(AlertsModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'alert-modal',
      disableClose: false,
      data: {newest: this.newest, oldest: this.oldest}
    });
    ref.afterClosed().subscribe(result => {
      this.changeViewToggleBtn.emit(false);
      // this.popUpService.attachData({ success: false, type: '', items: null });
    });
  }
}
