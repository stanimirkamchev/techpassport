import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private flag = 'erq';
  private subject = new BehaviorSubject(this.flag);
  public readonly flag$: Observable<string> = this.subject.asObservable();

  emitValue(flag: string): void {
    this.subject.next(flag);
  }
}
