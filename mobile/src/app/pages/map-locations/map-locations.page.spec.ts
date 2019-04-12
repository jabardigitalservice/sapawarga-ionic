import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLocationsPage } from './map-locations.page';

describe('MapLocationsPage', () => {
  let component: MapLocationsPage;
  let fixture: ComponentFixture<MapLocationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLocationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
