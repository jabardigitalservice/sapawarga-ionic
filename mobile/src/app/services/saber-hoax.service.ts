import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { UtilitiesService } from './utilities.service';
import { SaberHoax } from '../interfaces/saber-hoax';

@Injectable({
  providedIn: 'root'
})
export class SaberHoaxService {
  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private util: UtilitiesService
  ) {}

  getListSaberHoax(page: number): Observable<SaberHoax[]> {
    return this.http
      .get<SaberHoax[]>(`${environment.API_URL}/news-hoax?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }
}
