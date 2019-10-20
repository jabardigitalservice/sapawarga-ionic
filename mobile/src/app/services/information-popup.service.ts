import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { InformationPopupComponent } from '../shared/information-popup/information-popup.component';
import { catchError } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { formatDate } from '@angular/common';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class InformationPopupService {
  dataPopup: any;

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private modalController: ModalController,
    private constants: Constants
  ) {}

  checkInformationPopup() {
    this.getInformationPopup().subscribe(respons => {
      // console.log(respons.data.items[0]);
      this.dataPopup = respons.data.items[0];

      const lastDatePopup = this.getStoragePopup();
      const currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const endDate = formatDate(
        new Date(this.dataPopup.end_date),
        'yyyy/MM/dd',
        'en'
      );
      const getCompareDate = this.compareDate(
        currentDate,
        endDate,
        lastDatePopup
      );
      // this.setStoragePopup(currentDate);
      console.log(getCompareDate);
      console.log(lastDatePopup);
      // this.showModal();

      if (getCompareDate > 0) {
        this.showModal();
      }
    });
  }

  compareDate(currentDate: any, endDate: any, lastDatePopup: any): number {
    // compare dates, create a new instance of Date with 'new Date()'
    const current = new Date(currentDate);
    const end = new Date(endDate);
    const last = new Date(lastDatePopup);

    // Check if the first is less than second
    if (current <= end) {
      // Check if the dates are not equal
      if (current.getTime() !== last.getTime()) {
        this.setStoragePopup(currentDate);
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  private getInformationPopup(): Observable<any> {
    return this.http
      .get<any>(`${environment.API_MOCK}/popups`)
      .pipe(catchError(this.util.handleError));
  }

  setStoragePopup(value: string) {
    localStorage.setItem(this.constants.localStorage.informationPopup, value);
  }

  getStoragePopup() {
    return localStorage.getItem(this.constants.localStorage.informationPopup)
      ? localStorage.getItem(this.constants.localStorage.informationPopup)
      : '';
  }

  async showModal() {
    const modal = await this.modalController.create({
      component: InformationPopupComponent,
      cssClass: 'popup-information',
      backdropDismiss: false
    });
    return await modal.present();
  }
}
