import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRwPage } from './activity-rw.page';

describe('ActivityRwPage', () => {
  let component: ActivityRwPage;
  let fixture: ComponentFixture<ActivityRwPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRwPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
