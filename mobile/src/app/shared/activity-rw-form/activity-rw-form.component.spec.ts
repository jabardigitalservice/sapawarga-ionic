import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRwFormComponent } from './activity-rw-form.component';

describe('ActivityRwFormComponent', () => {
  let component: ActivityRwFormComponent;
  let fixture: ComponentFixture<ActivityRwFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRwFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRwFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
