import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AccessLog, AccessUserStatus, AccessLogStatus } from 'src/app/admin/store/superuser/superuser.model';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'access-log-table',
  templateUrl: './access-log-table.component.html',
  styleUrls: ['./access-log-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessLogTableComponent {

  @Input() loading: boolean;
  @Input() set accessLog(accessLog: AccessLog[]) {
    if (accessLog) {
      this.dataSource = new MatTableDataSource<AccessLog>(accessLog);
      this.dataSource.data = accessLog;
      this.dataSource.paginator = this.paginator;
    }
  }

  @Output() sort = new EventEmitter<Sort>();
  @Output() destroySession = new EventEmitter<AccessLog>();
  @Output() lockUser = new EventEmitter<AccessLog>();
  @Output() unlockUser = new EventEmitter<AccessLog>();
  @Output() deleteUser = new EventEmitter<AccessLog>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  AccessUserStatus = AccessUserStatus;
  AccessLogStatus = AccessLogStatus;
  displayedColumns = ['user.displayName', 'user.email', 'user.company', 'user.entityType', 'user.status', 'clientIP',
    'accessDate', 'accessDuration', 'status'];

  dataSource: MatTableDataSource<AccessLog> = new MatTableDataSource<AccessLog>();

  constructor(public apiService: ApiService) {

  }

  userAction(action: 'unlock' | 'lock' | 'delete', accessLog: AccessLog) {
    switch (action) {
      case 'unlock': this.unlockUser.emit(accessLog); break;
      case 'lock': this.lockUser.emit(accessLog); break;
      case 'delete': this.deleteUser.emit(accessLog); break;
    }
  }
}
