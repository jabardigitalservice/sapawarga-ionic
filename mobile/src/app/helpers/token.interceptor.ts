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
import { map, catchError } from 'rxjs/operators';
import { ToastController, NavController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

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
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error.success === false) {
            console.log('Login failed');
          } else {
            this.navCtrl.navigateRoot(['login']);
            // clear locastorage
            localStorage.clear();
          }
          this.showToast(error.error.data.name, error.error.data.message);
          this.navCtrl.navigateRoot(['login']);
          // clear locastorage
          localStorage.clear();
        }
        return throwError(error);
      })
    );
  }

  async showToast(title: string, msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
