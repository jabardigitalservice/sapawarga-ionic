import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollingDetailPage } from './polling-detail.page';

describe('PollingDetailPage', () => {
  let component: PollingDetailPage;
  let fixture: ComponentFixture<PollingDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollingDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
