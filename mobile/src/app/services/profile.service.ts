import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Profile } from '../interfaces/profile';
import { UtilitiesService } from './utilities.service';
import { JobTypes } from '../interfaces/job-types';

const PROFILE = 'PROFILE';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUserSubject: BehaviorSubject<Profile>;
  currentUser: Observable<Profile>;

  constructor(private http: HttpClient, private util: UtilitiesService) {
    this.currentUserSubject = new BehaviorSubject<Profile>(
      JSON.parse(localStorage.getItem(PROFILE)) || []
    );

    this.currentUser = this.currentUserSubject.asObservable();
  }

  getProfile(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${environment.API_URL}/user/me`).pipe(
      catchError(e => {
        const status = e.status;
        if (status === 401) {
          console.log('You are not authorized for this!');
          // this.logout();
        }
        throw new Error(status);
      })
    );
  }

  editProfile(data): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/user/me`, { UserEditForm: data })
      .pipe(catchError(this.util.handleError));
  }

  editPhotoProfile(image) {
    const input = new FormData();
    input.append('image', image);
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    return this.http
      .post(`${environment.API_URL}/user/photo`, input, HttpOptions)
      .pipe(catchError(this.util.handleError));
  }

  // save data into local storage
  saveProfile(data: Profile) {
    localStorage.setItem(PROFILE, JSON.stringify(data));
    this.currentUserSubject.next(data);
  }

  // save data into local storage
  getLocalProfile() {
    if (localStorage.getItem(PROFILE)) {
      return JSON.parse(localStorage.getItem(PROFILE));
    } else {
      return;
    }
  }

  changePassword(data: any): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/user/me/change-password`, data)
      .pipe(catchError(this.util.handleError));
  }

  getJobs() {
    return this.http
      .get<JobTypes[]>(`${environment.API_URL}/job-types`)
      .pipe(catchError(this.util.handleError));
  }
}
