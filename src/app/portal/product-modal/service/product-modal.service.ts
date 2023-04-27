import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductModalService {

  private expand = false;
  private expandSubject$ = new BehaviorSubject(this.expand);
  public readonly modalExpanded$: Observable<boolean> = this.expandSubject$.asObservable();

  setNewExpansionValue(val: boolean): void {
    this.expandSubject$.next(val);
  }

  expansionStyling(): Observable<'expandedContent' | 'collapsedContent'> {
    return this.modalExpanded$.pipe(
      map((isExpanded) => {
        return isExpanded ? 'expandedContent' : 'collapsedContent';
      })
    );
  }

  modalWindowExpansion() {
    return this.modalExpanded$.pipe(
      map((isExpanded) => {
        return isExpanded ? 'expandedAccordionItem' : 'collapsedAccordionItem';
      })
    );
  }
}
