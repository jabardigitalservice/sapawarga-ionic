import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiDetailPage } from './aspirasi-detail.page';

describe('AspirasiDetailPage', () => {
  let component: AspirasiDetailPage;
  let fixture: ComponentFixture<AspirasiDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirasiDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
