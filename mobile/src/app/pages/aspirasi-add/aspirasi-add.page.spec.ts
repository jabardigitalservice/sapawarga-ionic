import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiAddPage } from './aspirasi-add.page';

describe('AspirasiAddPage', () => {
  let component: AspirasiAddPage;
  let fixture: ComponentFixture<AspirasiAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirasiAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
