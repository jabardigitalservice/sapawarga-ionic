import { Injectable } from '@angular/core';
import { Constants } from '../helpers/constants';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForceUpdateService {
  insertData = {
    isChangePassword: false,
    isChangeProfile: false
  };

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private util: UtilitiesService
  ) {}

  // get data localStorage
  getDataForceChange() {
    const data = localStorage.getItem(this.constants.localStorage.forceChange)
      ? JSON.parse(
          localStorage.getItem(this.constants.localStorage.forceChange)
        )
      : '';
    return data;
  }

  // insert data to localStorage
  setDataForceChange(data: number) {
    if (data === 1) {
      // if data is 1 done change password
      this.insertData.isChangePassword = true;
    } else if (data === 2) {
      // if data is 2 done change edit profile
      this.insertData.isChangeProfile = true;
    }

    localStorage.setItem(
      this.constants.localStorage.forceChange,
      JSON.stringify(this.insertData)
    );
  }

  checkForceUpdate() {
    let stateUpdate: number;
    const dataForceChange = this.getDataForceChange();
    if (!dataForceChange) {
      stateUpdate = 0;
    } else if (dataForceChange.isChangePassword === false) {
      stateUpdate = 1;
    } else if (
      dataForceChange.isChangePassword === true &&
      dataForceChange.isChangeProfile === false
    ) {
      // console.log('enter modal force profile');

      stateUpdate = 2;
    }

    return stateUpdate;
  }

  PostForceChangeProfile(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/user/me/change-profile`, data)
      .pipe(catchError(this.util.handleError));
  }
}
