import { TestBed } from '@angular/core/testing';
import { NdaService } from '../../../nda.service';

describe('NdaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NdaService = TestBed.get(NdaService);
    expect(service).toBeTruthy();
  });
});
