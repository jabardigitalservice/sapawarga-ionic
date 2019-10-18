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
  dataPopup = {
    id: 1,
    title: 'West Java Investment Summit 2019',
    image_path: 'media/EG5lFOhUEAAXA79',
    image_path_url:
      'https://pbs.twimg.com/media/EG5lFOhUEAAXA79?format=jpg&name=small',
    type: 'external',
    link_url: 'https://twitter.com/humasjabar/status/1183994898569023490',
    internal_category: null,
    internal_entity_id: null,
    internal_entity_name: null,
    status: 10,
    status_label: 'Aktif',
    created_at: 1570177071,
    updated_at: 1570177071,
    created_by: 1,
    updated_by: 1,
    start_date: '2019-10-16',
    end_date: '2019-10-19'
  };

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private modalController: ModalController,
    private constants: Constants
  ) {}

  checkInformationPopup() {
    // this.getInformationPopup().subscribe(respons => {
    //   console.log(respons.data.items[0]);
    // this.dataPopup = respons.data.items[0];
    // });

    // this.showModal();

    const getDataPopup = localStorage.getItem(
      this.constants.localStorage.informationPopup
    );

    const currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    const endDate = formatDate(new Date('2019-10-17'), 'yyyy/MM/dd', 'en');
    const getCompareDate = this.compareDate(currentDate, endDate);
    console.log(getCompareDate);
    // console.log(now);
  }

  compareDate(date1: any, date2: any): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    // console.log(d1.getTime());
    // console.log(d2.getTime());

    // if (date1 < date2) {
    // }

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

  private getInformationPopup(): Observable<any> {
    return this.http
      .get<any>(`${environment.API_MOCK}/popups`)
      .pipe(catchError(this.util.handleError));
  }

  async showModal() {
    const modal = await this.modalController.create({
      component: InformationPopupComponent,
      cssClass: 'popup-information'
    });
    return await modal.present();
  }
}
