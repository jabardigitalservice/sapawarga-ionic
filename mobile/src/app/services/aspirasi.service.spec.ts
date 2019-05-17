import { TestBed } from '@angular/core/testing';

import { AspirasiService } from './aspirasi.service';

describe('AspirasiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AspirasiService = TestBed.get(AspirasiService);
    expect(service).toBeTruthy();
  });
});
