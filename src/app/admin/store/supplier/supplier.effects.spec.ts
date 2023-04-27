import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SupplierEffects } from './supplier.effects';

describe('SupplierEffects', () => {
  let actions$: Observable<any>;
  let effects: SupplierEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SupplierEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SupplierEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
