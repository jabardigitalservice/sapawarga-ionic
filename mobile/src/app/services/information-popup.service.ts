import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InformationPopupComponent } from '../shared/information-popup/information-popup.component';

@Injectable({
  providedIn: 'root'
})
export class InformationPopupService {
  constructor(private modalController: ModalController) {}

  async showModal() {
    const modal = await this.modalController.create({
      component: InformationPopupComponent,
      cssClass: 'popup-information'
    });
    return await modal.present();
  }
}
