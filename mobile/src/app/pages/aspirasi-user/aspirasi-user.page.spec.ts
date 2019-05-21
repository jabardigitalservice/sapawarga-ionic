import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiUserPage } from './aspirasi-user.page';

describe('AspirasiUserPage', () => {
  let component: AspirasiUserPage;
  let fixture: ComponentFixture<AspirasiUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirasiUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
