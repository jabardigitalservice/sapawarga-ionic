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
  isLoading = false;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private surveyService: SurveyService,
    private iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public constants: Constants,
    private util: UtilitiesService
  ) {
    this.dataSurvey = [];
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.survey);

    this.util.trackEvent(
      this.constants.pageName.survey,
      'view_list_survei',
      '',
      1
    );

    this.getListSurvey();
  }

  getListSurvey(infiniteScroll?) {
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

    this.dataEmpty = false;

    if (!infiniteScroll) {
      this.isLoading = true;
    }

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
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }

        this.isLoading = false;
      },
      err => {
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
        this.isLoading = false;
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
