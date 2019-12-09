import { TestBed } from '@angular/core/testing';

import { QuestionAndAnswerService } from './question-and-answer.service';

describe('QuestionAndAnswerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionAndAnswerService = TestBed.get(QuestionAndAnswerService);
    expect(service).toBeTruthy();
  });
});
