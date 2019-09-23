import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaberHoaxPage } from './saber-hoax.page';

describe('SaberHoaxPage', () => {
  let component: SaberHoaxPage;
  let fixture: ComponentFixture<SaberHoaxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaberHoaxPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaberHoaxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
