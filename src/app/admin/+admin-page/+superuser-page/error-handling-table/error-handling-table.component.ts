import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ErrorHandling } from 'src/app/admin/store/superuser/superuser.model';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'error-handling-table',
  templateUrl: './error-handling-table.component.html',
  styleUrls: ['./error-handling-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlingTableComponent {

  @Input() loading: boolean;
  @Input() set errorHandling(errorHandling: ErrorHandling[]) {
    if (errorHandling) {
      this.dataSource = new MatTableDataSource<ErrorHandling>(errorHandling);
      this.dataSource.data = errorHandling;
      this.dataSource.paginator = this.paginator;
    }
  }

  @Output() sort = new EventEmitter<Sort>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns = [
    'errorId',
    'type',
    'details',
    'date'
  ];

  dataSource: MatTableDataSource<ErrorHandling> = new MatTableDataSource<ErrorHandling>();

}
