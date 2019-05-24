import { TestBed } from '@angular/core/testing';

import { FetchReadingService } from './fetch-reading.service';

describe('FetchReadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchReadingService = TestBed.get(FetchReadingService);
    expect(service).toBeTruthy();
  });
});
