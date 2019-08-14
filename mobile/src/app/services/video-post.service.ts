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

  getListvideoPost(param: string): Observable<VideoPost[]> {
    return this.http
      .get<VideoPost[]>(
        `${
          environment.API_URL
        }/videos?sort_by=seq&sort_order=ascending&${param}`
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
