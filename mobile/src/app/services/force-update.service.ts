import { Injectable } from '@angular/core';
import { Constants } from '../helpers/constants';
import { ModalController } from '@ionic/angular';
import { ForceChangePasswordComponent } from '../shared/force-change-password/force-change-password.component';

@Injectable({
  providedIn: 'root'
})
export class ForceUpdateService {
  insertData = {
    isChangePassword: false,
    isChangeProfile: false
  };

  constructor(
    private constants: Constants,
    private modalController: ModalController
  ) {}

  isForceChange() {
    // check is step force change password and profile was complete
    // const data = this.getDataForceUpdate();
    // if(data) {
    // }
  }

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
  setDataForceChange(data?: number) {
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
}
