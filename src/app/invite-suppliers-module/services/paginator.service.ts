
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Paginator } from '../invite-suppliers.model';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  private pagination: Paginator = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    dataCount: 0
  };

  private $paginationBehavior = new BehaviorSubject(this.pagination);

  public readonly paginationOverview: Observable<Paginator> = this.$paginationBehavior.asObservable();

  setPagination(obj: Partial<Paginator>) {
    const prevPagination = this.$paginationBehavior.getValue();

    this.$paginationBehavior.next({
      ...prevPagination,
      ...obj
    });
  }

  sliceFunc() {
    const pagination = this.$paginationBehavior.getValue();
    return [
      (pagination.pageIndex - 1) * pagination.pageSize
      , pagination.pageSize + (pagination.pageIndex - 1) * pagination.pageSize
    ];
  }
}
