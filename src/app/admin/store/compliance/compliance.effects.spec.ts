import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ComplianceEffects } from './compliance.effects';

describe('ComplianceEffects', () => {
  let actions$: Observable<any>;
  let effects: ComplianceEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComplianceEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ComplianceEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
