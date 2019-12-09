import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAndAnswerDetailPage } from './question-and-answer-detail.page';

describe('QuestionAndAnswerDetailPage', () => {
  let component: QuestionAndAnswerDetailPage;
  let fixture: ComponentFixture<QuestionAndAnswerDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAndAnswerDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAndAnswerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
