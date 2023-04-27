import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getName } from 'country-list';

import { AccessManagement, AccessUserStatus } from 'src/app/admin/store/superuser/superuser.model';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'access-management-table',
  templateUrl: './access-management-table.component.html',
  styleUrls: ['./access-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessManagementTableComponent implements OnInit {

  @Input() loading: boolean;
  @Input() set accessManagement(accessManagement: AccessManagement[]) {
    if (accessManagement) {
      this.dataSource = new MatTableDataSource<AccessManagement>(accessManagement);
      this.dataSource.data = accessManagement;
      this.dataSource.paginator = this.paginator;
    }
  }

  @Output() sort = new EventEmitter<Sort>();
  @Output() lockUser = new EventEmitter<{ user: AccessManagement }>();
  @Output() unlockUser = new EventEmitter<{ user: AccessManagement }>();
  @Output() deleteUser = new EventEmitter<{ user: AccessManagement }>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  getCountryName = getName;
  AccessUserStatus = AccessUserStatus;
  displayedColumns = [
    'displayName',
    'email',
    'phone',
    'role',
    'createdAt',
    'accessDuration',
    'lastAccessed',
    'connectionsInProgress',
    'connectionsCompleted',
    'type',
    'company',
    'companyCountry',
    'status'
  ];

  dataSource: MatTableDataSource<AccessManagement> = new MatTableDataSource<AccessManagement>();

  constructor(public apiService: ApiService) { }

  ngOnInit() {
  }

  userAction(action: 'unlock' | 'lock' | 'delete', accessManagement: AccessManagement) {
    switch (action) {
      case 'unlock': this.unlockUser.emit({ user: accessManagement }); break;
      case 'lock': this.lockUser.emit({ user: accessManagement }); break;
      case 'delete': this.deleteUser.emit({ user: accessManagement }); break;
    }
  }
}
