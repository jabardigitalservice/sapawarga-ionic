import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities.service';
import { Constants } from '../helpers/constants';
import { Observable } from 'rxjs';
import { UserPost } from '../interfaces/user-post';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {
  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  /**
   *
   *
   * @param {number} [page]
   * @returns {Observable<UserPost[]>}
   * @memberof UserPostService
   */
  getListUserPosts(page?: number): Observable<UserPost[]> {
    return this.http
      .get<UserPost[]>(
        `${environment.API_URL}/user-posts?page=${page ? page : null}`
      )
      .pipe(catchError(this.util.handleError));
  }

  getDetailUserPost(id: number): Observable<UserPost> {
    return this.http
      .get<UserPost>(`${environment.API_URL}/user-posts/${id}`)
      .pipe(catchError(this.util.handleError));
  }
}
