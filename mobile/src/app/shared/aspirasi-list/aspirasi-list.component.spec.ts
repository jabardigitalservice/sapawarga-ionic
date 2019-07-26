import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirasiListComponent } from './aspirasi-list.component';

describe('AspirasiListComponent', () => {
  let component: AspirasiListComponent;
  let fixture: ComponentFixture<AspirasiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirasiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirasiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
