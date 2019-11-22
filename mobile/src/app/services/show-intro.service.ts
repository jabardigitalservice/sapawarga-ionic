import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';

export interface Steps {
  element: string;
  intro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowIntroService {
  intro = introJs;

  constructor() {}

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

  skipIntro() {
    this.intro().exit();
  }
}
