import { TestBed } from '@angular/core/testing';

import { NotifikasiService } from './notifikasi.service';

describe('NotifikasiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifikasiService = TestBed.get(NotifikasiService);
    expect(service).toBeTruthy();
  });
});
