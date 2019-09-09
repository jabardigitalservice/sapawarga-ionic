import { Injectable } from '@angular/core';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class ForceUpdateService {
  insertData = {
    isChangePassword: false,
    isChangeProfile: false
  };

  constructor(private constants: Constants) {}

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
  setDataForceChange(data: number) {
    if (data === 1) {
      this.insertData.isChangePassword = true;
    } else if (data === 2) {
      this.insertData.isChangeProfile = true;
    }

    localStorage.setItem(
      this.constants.localStorage.forceChange,
      JSON.stringify(this.insertData)
    );
    // console.log('hai');
  }
}
