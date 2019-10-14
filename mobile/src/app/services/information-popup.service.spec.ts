import { TestBed } from '@angular/core/testing';

import { InformationPopupService } from './information-popup.service';

describe('InformationPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InformationPopupService = TestBed.get(InformationPopupService);
    expect(service).toBeTruthy();
  });
});
