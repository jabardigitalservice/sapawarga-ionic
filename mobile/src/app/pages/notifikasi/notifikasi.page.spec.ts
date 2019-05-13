import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifikasiPage } from './notifikasi.page';

describe('NotifikasiPage', () => {
  let component: NotifikasiPage;
  let fixture: ComponentFixture<NotifikasiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifikasiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifikasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
