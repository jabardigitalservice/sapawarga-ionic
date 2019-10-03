import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumasJabarComponent } from './humas-jabar.component';

describe('HumasJabarComponent', () => {
  let component: HumasJabarComponent;
  let fixture: ComponentFixture<HumasJabarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumasJabarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumasJabarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
