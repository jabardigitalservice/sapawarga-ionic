import { TestBed } from '@angular/core/testing';

import { SaberHoaxService } from './saber-hoax.service';

describe('SaberHoaxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaberHoaxService = TestBed.get(SaberHoaxService);
    expect(service).toBeTruthy();
  });
});
