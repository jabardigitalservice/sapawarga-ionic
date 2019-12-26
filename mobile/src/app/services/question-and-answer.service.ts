import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { QuestionAndAnswer } from '../interfaces/question-and-answer';
import { Constants } from '../helpers/constants';
import { ModalController } from '@ionic/angular';
import { QuestionAndAnswerFormComponent } from '../shared/question-and-answer-form/question-and-answer-form.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionAndAnswerService {
  isNewQnA = new BehaviorSubject(
    JSON.parse(localStorage.getItem(this.constants.localStorage.newQnA)) || null
  );

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private constants: Constants,
    private modalController: ModalController
  ) {}

  /**
   * @param {number} [page]
   * @returns {Observable<QuestionAndAnswer[]>}
   * @memberof QuestionAndAnswerService
   */
  getListQnA(page?: number): Observable<QuestionAndAnswer[]> {
    return this.http
      .get<QuestionAndAnswer[]>(
        `${environment.API_URL}/questions?page=${page ? page : null}`
      )
      .pipe(catchError(this.util.handleError));
  }

  /**
   * @param {number} id
   * @returns {Observable<QuestionAndAnswer>}
   * @memberof QuestionAndAnswerService
   */
  getDetailQnA(id: number): Observable<QuestionAndAnswer> {
    return this.http
      .get<QuestionAndAnswer>(`${environment.API_URL}/questions/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  /**
   * @param {number} id
   * @returns {Observable<QuestionAndAnswer[]>}
   * @memberof QuestionAndAnswerService
   */
  getListCommentQnA(id: number): Observable<QuestionAndAnswer[]> {
    return this.http
      .get<QuestionAndAnswer[]>(
        `${environment.API_URL}/questions/${id}/comments`
      )
      .pipe(catchError(this.util.handleError));
  }

  /**
   * @param {string} text
   * @returns {Observable<QuestionAndAnswer>}
   * @memberof QuestionAndAnswerService
   */
  PostNewQnA(text: string): Observable<QuestionAndAnswer> {
    const data = {
      text: text,
      status: 10,
      is_flagged: 0
    };

    return this.http
      .post<QuestionAndAnswer>(`${environment.API_URL}/questions`, data)
      .pipe(catchError(this.util.handleError));
  }

  PostLiked(id: number): Observable<QuestionAndAnswer> {
    return this.http
      .post<QuestionAndAnswer>(
        `${environment.API_URL}/questions/likes/${id}`,
        null
      )
      .pipe(catchError(this.util.handleError));
  }

  /**
   * @param {string} name //name of local storage
   * @param {object} data
   * @memberof QuestionAndAnswerService
   */
  saveLocal(name: string, data: object) {
    const newQnA = this.constants.localStorage.newQnA;

    if (name === newQnA) {
      // clear data storage newQnA
      this.clearNewLocalQnA();

      // set observable to true
      this.isNewQnA.next(data);
    }

    localStorage.setItem(name, JSON.stringify(data));
  }

  /**
   * @param {string} name
   * @returns
   * @memberof QuestionAndAnswerService
   */
  getLocal(name: string) {
    return localStorage.getItem(name)
      ? JSON.parse(localStorage.getItem(name))
      : '';
  }

  clearNewLocalQnA() {
    // clear data storage newQnA
    localStorage.removeItem(this.constants.localStorage.newQnA);

    // set observable to empty
    this.isNewQnA.next(null);
  }

  async showModalAddQnA() {
    const modal = await this.modalController.create({
      cssClass: 'form-qna',
      backdropDismiss: false,
      component: QuestionAndAnswerFormComponent
    });
    return await modal.present();
  }
}
