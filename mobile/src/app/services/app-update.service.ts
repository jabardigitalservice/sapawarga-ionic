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
          const dataVersion = respon.version;
          const forceUpdate = respon.force_update;
          const VersionSistem = sistemVersion.split('-')[0]; // parsing version sistem

          if (dataVersion !== VersionSistem && forceUpdate) {
            this.util.presentModal();
          }
        });
      })
      .catch(_ => {});
  }
}
