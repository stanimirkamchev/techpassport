import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DashboardResources } from '../../store/dashboard.model';
import { State } from '../../store/dashboard.reducer';
import { setResourcesUsers } from '../../store/dashboard.actions';
import { selectDashboardResourcesUsersChartData } from '../../store/dashboard.selectors';
import { LineChart } from '@shared/chart-line/chart-line.component';

@Component({
  selector: 'dashboard-resources',
  templateUrl: './dashboard-resources.component.html',
  styleUrls: ['./dashboard-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardResourcesComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Input() resources: DashboardResources;

  usersChartData$: Observable<LineChart>;
  formGroup = new FormGroup({
    user: new FormControl('')
  });

  private destroyed$ = new Subject();

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.usersChartData$ = this.store.select(selectDashboardResourcesUsersChartData);
    this.formGroup.get('user').valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(users => this.store.dispatch(setResourcesUsers({ users })));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // getDataForUser(userIds: string[]) {
  //   let ds = [];
  //   for (let id of userIds) {
  //     let oneSet = this.resources.users.find(x => x._id === id);
  //     ds.push({ fill: false, data: oneSet.data.total });
  //   }
  //   let labels = ds[0].data.map(x => x.x.split("T")[0]);
  //   return {
  //     data: {
  //       datasets: ds,
  //       labels: labels
  //     },
  //     title: "Resources",
  //     options: {

  //     }
  //   };
  // }
}
