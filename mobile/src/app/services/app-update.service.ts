import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private http: HttpClient, private appVersion: AppVersion) {}

  getVersionNumber() {
    return this.http.get<any>(`${environment.API_MOCK}/releases`).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  checkAppUpdate() {
    let updateApp: boolean;

    this.getVersionNumber().subscribe(val => {
      const dataVersion = val['data']['items'][0].version;
      // console.log(dataVersion);
      this.appVersion
        .getVersionNumber()
        .then(sistemVersion => {
          console.log(sistemVersion);
          if (dataVersion === sistemVersion) {
            updateApp = true;
          } else {
            updateApp = false;
          }
        })
        .catch(_ => {
          updateApp = false;
        });
    });

    return updateApp;
  }
}
