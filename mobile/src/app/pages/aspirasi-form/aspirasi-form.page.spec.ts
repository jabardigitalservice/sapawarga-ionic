import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiFormPage } from './aspirasi-form.page';

describe('AspirasiFormPage', () => {
  let component: AspirasiFormPage;
  let fixture: ComponentFixture<AspirasiFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AspirasiFormPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
