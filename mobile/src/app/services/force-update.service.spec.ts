import { TestBed } from '@angular/core/testing';

import { ForceUpdateService } from './force-update.service';

describe('ForceUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForceUpdateService = TestBed.get(ForceUpdateService);
    expect(service).toBeTruthy();
  });
});
