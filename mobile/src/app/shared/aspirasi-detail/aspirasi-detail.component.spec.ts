import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiDetailComponent } from './aspirasi-detail.component';

describe('AspirasiDetailComponent', () => {
  let component: AspirasiDetailComponent;
  let fixture: ComponentFixture<AspirasiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirasiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
