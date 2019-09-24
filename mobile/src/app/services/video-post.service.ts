import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoPost } from '../interfaces/video-post';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPostService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListvideoPost(
    limit?: number,
    idkabkota?: number
  ): Observable<VideoPost[]> {
    let param: string;
    // check param limit
    if (limit && !idkabkota) {
      param = `?limit=${limit}`;
    } else if (idkabkota) {
      param = `?limit=${limit}&kabkota_id=${idkabkota}`;
    } else {
      param = '';
    }

    return this.http
      .get<VideoPost[]>(
        `${environment.API_URL}/videos?sort_by=seq&sort_order=ascending&${param}`
      )
      .pipe(catchError(this.util.handleError));
  }

  // save data headlines into local storage
  saveLocal(name: string, data: object) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  // get data headlines into local storage
  getLocal(name: string) {
    return localStorage.getItem(name) ? localStorage.getItem(name) : '';
  }
}
