import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { UtilitiesService } from './utilities.service';
import { BehaviorSubject } from 'rxjs';

export interface Steps {
  element?: string;
  intro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowIntroService {
  intro = introJs;
  finalStepQnA = new BehaviorSubject(false);
  isShowModal = new BehaviorSubject(false);

  constructor(private util: UtilitiesService) {}

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
        if (step === 1) {
          this.isShowModal.next(true);
        } else if (step === 2) {
          this.intro().exit();
          this.util.dismissModal();
          this.finalStepQnA.next(true);
        } else if (step === 3) {
          localStorage.setItem(storageName, 'true');
          this.intro().exit();
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
}
