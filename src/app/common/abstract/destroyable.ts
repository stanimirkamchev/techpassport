import { OnDestroy, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class Destroyable implements OnDestroy {
  protected destroyed$ = new Subject();

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
