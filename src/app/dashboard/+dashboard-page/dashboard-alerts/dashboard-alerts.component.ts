import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store';
import { openAlertsConnections } from '../../store/dashboard.actions';
import { DashboardAlerts } from '../../store/dashboard.model';

@Component({
  selector: 'dashboard-alerts',
  templateUrl: './dashboard-alerts.component.html',
  styleUrls: ['./dashboard-alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAlertsComponent implements OnInit {

  @Input() alerts: DashboardAlerts;
  @Input() loading: boolean;

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  openConnections(alerts: DashboardAlerts, box: string, allBusinessGroups: boolean) {
    this.store.dispatch(openAlertsConnections({ alerts, box, allBusinessGroups }));
  }
}
