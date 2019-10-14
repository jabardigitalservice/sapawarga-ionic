import { Component, OnInit } from '@angular/core';
import {
  InAppBrowser,
  InAppBrowserOptions
} from '@ionic-native/in-app-browser/ngx';
import { SurveyService } from '../../services/survey.service';
import { Survey } from '../../interfaces/survey';
import { LoadingController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute } from '@angular/router';

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
  isPushNotification = false;

  constructor(
    private surveyService: SurveyService,
    private iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public constants: Constants,
    private util: UtilitiesService,
    private route: ActivatedRoute
  ) {
    this.dataSurvey = [];
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.survey);

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });

    this.util.trackEvent(
      this.constants.pageName.survey,
      'view_list_survei',
      '',
      1
    );

    this.getListSurvey();
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
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
  goDetail(url: string, title: string) {
    const target = '_self';
    this.iab.create(url, target, this.constants.inAppBrowserOptions);

    // create event google analytics
    this.util.trackEvent(
      this.constants.pageName.survey,
      'create_survei_answer',
      title,
      1
    );
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
