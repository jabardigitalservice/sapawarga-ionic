import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { ModalController } from '@ionic/angular';
import { QuestionAndAnswerFormComponent } from '../shared/question-and-answer-form/question-and-answer-form.component';
import { UtilitiesService } from './utilities.service';

export interface Steps {
  element: string;
  intro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowIntroService {
  intro = introJs;

  constructor(
    private modalController: ModalController,
    private util: UtilitiesService
  ) {}

  /**
   *
   *
   * @param {Array<Steps>} steps // array of list id step & description
   * @param {string} pageSelector // identify page
   * @param {string} storageName  // name of storage
   * @memberof ShowIntroService
   */
  showIntro(steps: Array<Steps>, pageSelector: string, storageName: string) {
    this.intro(document.querySelector(pageSelector))
      .setOptions({
        steps: steps,
        nextLabel: 'Lanjut',
        prevLabel: 'Kembali',
        skipLabel: 'Lewati!',
        doneLabel: 'Selesai',
        showProgress: true,
        exitOnEsc: false,
        exitOnOverlayClick: false,
        scrollTo: true,
        showBullets: false
      })
      .start()
      .oncomplete(() => {
        localStorage.setItem(storageName, 'true');
      });
  }

  showIntroQnA(
    step: number,
    steps: Array<Steps>,
    pageSelector: string,
    storageName?: string
  ) {
    this.intro(document.querySelector(pageSelector))
      .setOptions({
        steps: steps,
        nextLabel: 'Lanjut',
        prevLabel: 'Kembali',
        skipLabel: 'Lewati!',
        doneLabel: step !== 3 ? 'Lanjut' : 'Selesai',
        showProgress: false,
        exitOnEsc: false,
        exitOnOverlayClick: false,
        scrollTo: true,
        showBullets: false,
        showStepNumbers: false,
        disableInteraction: true
      })
      .start()
      .oncomplete(() => {
        console.log(step);
        if (step === 1) {
          this.showModalAddQnA();
        } else if (step === 2) {
          this.util.dismissModal();
        } else if (step === 3) {
          localStorage.setItem(storageName, 'true');
        }
      });
  }

  /**
   *
   *
   * @param {string} storageName  // name of storage
   * @memberof ShowIntroService
   */
  skipIntro(storageName: string) {
    this.intro().exit();
    localStorage.setItem(storageName, 'true');
  }

  async showModalAddQnA() {
    const modal = await this.modalController.create({
      cssClass: 'form-qna',
      backdropDismiss: false,
      component: QuestionAndAnswerFormComponent
    });
    return await modal.present();
  }
}
