import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { Survey } from '../interfaces/survey';

const SURVEY = 'data-survey';
@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListSurvey(page: number): Observable<Survey> {
    return this.http
      .get<Survey>(`${environment.API_URL}/survey?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }

  getDetailSurvey(id: number): Observable<Survey> {
    return this.http
      .get<Survey>(`${environment.API_URL}/survey/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  // save SURVEY into local storage
  saveLocalSurvey(data: object) {
    localStorage.setItem(SURVEY, JSON.stringify(data));
  }

  // get SURVEY into local storage
  getLocalSurvey() {
    return JSON.parse(localStorage.getItem(SURVEY));
  }
}
