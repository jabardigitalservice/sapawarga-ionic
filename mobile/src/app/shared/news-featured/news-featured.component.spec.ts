import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFeaturedComponent } from './news-featured.component';

describe('NewsFeaturedComponent', () => {
  let component: NewsFeaturedComponent;
  let fixture: ComponentFixture<NewsFeaturedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsFeaturedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
