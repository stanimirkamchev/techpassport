import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store';
import { openAlertsConnections } from '../../store/dashboard.actions';
import { DashboardAlerts } from '../../store/dashboard.model';

@Component({
  selector: 'dashboard-summary',
  templateUrl: './dashboard-summary.component.html',
  styleUrls: ['./dashboard-summary.component.scss']
})
export class DashboardSummaryComponent implements OnInit {

  constructor(private store: Store<State>) { }

  @Input() alerts: DashboardAlerts;
  @Input() loading: boolean;

  ngOnInit(): void {
  }

  openConnections(alerts: DashboardAlerts, box: string, allBusinessGroups: boolean) {
    // redesign dashboard client's feedback. Temporary disabled
    // this.store.dispatch(openAlertsConnections({ alerts, box, allBusinessGroups }));
  }
}
