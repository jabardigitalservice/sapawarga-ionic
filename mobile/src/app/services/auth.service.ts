import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { UtilitiesService } from './utilities.service';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private plt: Platform,
    private util: UtilitiesService,
    private constants: Constants
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  // check if token true
  checkToken() {
    if (localStorage.getItem(this.constants.localStorage.authToken)) {
      this.authenticationState.next(true);
    }
  }

  // call API login
  login(data): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/user/login`, { LoginForm: data })
      .pipe(catchError(this.util.handleError));
  }

  // save token into local storage
  saveToken(token: string) {
    localStorage.setItem(this.constants.localStorage.authToken, token);
    this.authenticationState.next(true);
  }

  // logout and clear session
  logout() {
    // clear data local storages
    localStorage.removeItem(this.constants.localStorage.authToken);
    localStorage.removeItem(this.constants.localStorage.videoPostData);
    localStorage.removeItem(this.constants.localStorage.profileData);
    localStorage.removeItem(this.constants.localStorage.NewsHeadlines);
    localStorage.removeItem(this.constants.localStorage.NewsKabkotaHeadlines);
    localStorage.removeItem(this.constants.localStorage.notification);
    localStorage.removeItem(this.constants.localStorage.broadcastData);
    localStorage.removeItem(this.constants.localStorage.broadcast);
    localStorage.removeItem(this.constants.localStorage.aspirasi);
    localStorage.removeItem(this.constants.localStorage.aspirasiLikes);
    localStorage.removeItem(this.constants.localStorage.aspirasiUser);
    localStorage.removeItem(this.constants.localStorage.pollingData);
    localStorage.removeItem(this.constants.localStorage.surveyData);
    localStorage.removeItem(this.constants.localStorage.forceChange);

    this.authenticationState.next(false);

    const httpPost = this.http
      .post(`${environment.API_URL}/user/logout`, null)
      .pipe(
        tap(res => {}),
        catchError(this.util.handleError)
      );

    return httpPost;
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  deleteDataLocal(key: string) {
    localStorage.removeItem(key);
  }
}
