import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { UtilitiesService } from './utilities.service';
import { Constants } from '../helpers/constants';

const TOKEN_KEY = 'auth-token';

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
    if (localStorage.getItem(TOKEN_KEY)) {
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
    localStorage.setItem(TOKEN_KEY, token);
    this.authenticationState.next(true);
  }

  // logout and clear session
  logout() {
    localStorage.clear();
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
