import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, delay, timeout } from 'rxjs/operators';
import { NavController, Platform } from '@ionic/angular';
import { UtilitiesService } from '../services/utilities.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  app_version: string;
  constructor(
    private navCtrl: NavController,
    private util: UtilitiesService,
    private platform: Platform,
    public appVersion: AppVersion
  ) {
    if (this.platform.platforms()) {
      this.appVersion
        .getVersionNumber()
        .then(res => {
          this.app_version = res;
        })
        .catch(err => {});
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth-token')
      ? localStorage.getItem('auth-token')
      : '';
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
          // 'X-Requested-With-Version': this.app_version ? this.app_version : ''
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
          // 'X-Requested-With-Version': this.app_version ? this.app_version : ''
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      delay(1000),
      timeout(10000),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.util.showToast(error.error.data.message);
          this.navCtrl.navigateRoot(['login']);

          localStorage.removeItem('auth-token');
        }
        return throwError(error);
      })
    );
  }
}
