import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollingPage } from './polling.page';

describe('PollingPage', () => {
  let component: PollingPage;
  let fixture: ComponentFixture<PollingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
