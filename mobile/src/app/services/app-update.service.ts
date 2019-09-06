import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(
    private http: HttpClient,
    private appVersion: AppVersion,
    private util: UtilitiesService
  ) {}

  private getVersionNumberAPI() {
    return this.http.get<any>(`${environment.API_MOCK}/releases`).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  checkAppUpdate() {
    this.appVersion
      .getVersionNumber()
      .then(sistemVersion => {
        this.getVersionNumberAPI().subscribe(val => {
          const dataVersion = val['data']['items'][0].version;
          const forceUpdate = val['data']['items'][0].force_update;
          console.log('versi API ' + dataVersion);
          console.log('versi sistem ' + sistemVersion);

          if (dataVersion !== sistemVersion && forceUpdate) {
            this.util.presentModal();
          }
        });
      })
      .catch(_ => {});
  }
}
