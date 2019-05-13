import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrasiPage } from './administrasi.page';

describe('AdministrasiPage', () => {
  let component: AdministrasiPage;
  let fixture: ComponentFixture<AdministrasiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrasiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
