import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaberHoaxDetailPage } from './saber-hoax-detail.page';

describe('SaberHoaxDetailPage', () => {
  let component: SaberHoaxDetailPage;
  let fixture: ComponentFixture<SaberHoaxDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaberHoaxDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaberHoaxDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
