import { Injectable } from '@angular/core';

// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(
    private nativeHttp: HTTP,
    private appVersion: AppVersion,
    private util: UtilitiesService
  ) {}

  private getVersionNumberAPI() {
    // return this.http.get<any>(`${environment.API_STORAGE}/version.json`).pipe(
    //   catchError(e => {
    //     throw new Error(e);
    //   })
    // );

    return this.nativeHttp.get(
      `${environment.API_STORAGE}/version.json`,
      {},
      { 'Content-Type': 'application/json' }
    );
  }

  checkAppUpdate() {
    this.appVersion
      .getVersionNumber()
      .then(sistemVersion => {
        this.getVersionNumberAPI().then(val => {
          const respon = JSON.parse(val.data);
          console.log(respon);
          const dataVersion = respon.version;
          const forceUpdate = respon.force_update;

          if (dataVersion !== sistemVersion && forceUpdate) {
            this.util.presentModal();
          }
        });
      })
      .catch(_ => {});
  }
}
