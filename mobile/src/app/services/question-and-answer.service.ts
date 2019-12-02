import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { QuestionAndAnswer } from '../interfaces/question-and-answer';

@Injectable({
  providedIn: 'root'
})
export class QuestionAndAnswerService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListQnA(page?: number): Observable<QuestionAndAnswer[]> {
    return this.http
      .get<QuestionAndAnswer[]>(
        `${environment.API_MOCK}/questions?page=${page ? page : null}`
      )
      .pipe(catchError(this.util.handleError));
  }
}
