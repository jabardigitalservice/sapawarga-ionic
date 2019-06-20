import { Component, OnInit } from '@angular/core';
import {
  InAppBrowser,
  InAppBrowserOptions
} from '@ionic-native/in-app-browser/ngx';
import { SurveyService } from '../../services/survey.service';
import { Survey } from '../../interfaces/survey';
import { LoadingController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss']
})
export class SurveyPage implements OnInit {
  dataSurvey: Survey[];
  currentPage = 1;
  maximumPages: number;

  dataEmpty = false;

  msgResponse = {
    type: '',
    msg: ''
  };

  options: InAppBrowserOptions = {
    location: 'yes', // Or 'no'
    hidden: 'no', // Or  'yes'
    hideurlbar: 'yes',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', // Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', // Android only
    closebuttoncaption: 'Close', // iOS only
    disallowoverscroll: 'no', // iOS only
    toolbar: 'yes', // iOS only
    enableViewportScale: 'no', // iOS only
    allowInlineMediaPlayback: 'no', // iOS only
    presentationstyle: 'pagesheet', // iOS only
    fullscreen: 'yes', // Windows only
    toolbartranslucent: 'yes'
  };

  constructor(
    private surveyService: SurveyService,
    private iab: InAppBrowser,
    public loadingCtrl: LoadingController
  ) {
    this.dataSurvey = [];
  }

  ngOnInit() {
    this.getListSurvey();
  }

  async getListSurvey(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.surveyService.getLocalSurvey()) {
        this.dataSurvey = this.surveyService.getLocalSurvey();
      } else {
        this.msgResponse = {
          type: 'offline',
          msg: Dictionary.offline
        };
      }
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
    }

    this.dataEmpty = false;

    this.surveyService.getListSurvey(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataSurvey = this.dataSurvey.concat(res['data']['items']);

          // save to local
          this.surveyService.saveLocalSurvey(this.dataSurvey);
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      err => {
        loader.dismiss();
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }

        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  ionViewDidEnter() {}

  // go to detail surveyy with param id
  goDetail(url: string) {
    console.log(url);
    // this.router.navigate(['/survey', id]);
    const target = '_self';
    this.iab.create(url, target, this.options);
  }

  // infinite scroll
  doInfinite(event) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListSurvey(event);
    }, 2000);
  }
}
