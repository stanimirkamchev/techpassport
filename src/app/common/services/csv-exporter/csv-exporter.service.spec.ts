import { TestBed } from '@angular/core/testing';

import { CsvExporterService } from './csv-exporter.service';

describe('CsvExporterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvExporterService = TestBed.get(CsvExporterService);
    expect(service).toBeTruthy();
  });
});
