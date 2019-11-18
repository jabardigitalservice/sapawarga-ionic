import { Component, OnInit } from '@angular/core';
import { InformationPopup } from '../../interfaces/information-popup';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';
import { NavParams, LoadingController } from '@ionic/angular';
import { Constants } from '../../helpers/constants';
import { Dictionary } from '../../helpers/dictionary';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-information-popup',
  templateUrl: './information-popup.component.html',
  styleUrls: ['./information-popup.component.scss']
})
export class InformationPopupComponent implements OnInit {
  dataPopup: InformationPopup;
  constructor(
    private navParams: NavParams,
    private util: UtilitiesService,
    private router: Router,
    private constants: Constants,
    private loadingCtrl: LoadingController,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.dataPopup = this.navParams.get('dataPopup');
  }

  btnClose() {
    this.util.dismissModal();
  }

  goToDetail() {
    const action = 'tapped_detail_information_popup';

    if (this.dataPopup.type === 'external') {
      this.util.launchweb(this.dataPopup.link_url);
    } else if (
      this.dataPopup.type === 'internal' &&
      this.dataPopup.internal_object_type === 'survey'
    ) {
      this.getDetailSurvey(this.dataPopup.internal_object_id);
    } else if (this.dataPopup.type === 'internal') {
      this.router.navigate([
        `/${this.dataPopup.internal_object_type}`,
        this.dataPopup.internal_object_id
      ]);
    }

    // add event
    this.util.trackEvent(
      this.constants.pageName.informationPopup,
      action,
      this.dataPopup.title,
      1
    );

    // close modal
    this.btnClose();
  }

  async getDetailSurvey(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.surveyService.getDetailSurvey(id).subscribe(
      res => {
        if (res['status'] === 200) {
          const external_url = res['data'].external_url;
          this.util.launchweb(external_url);
        }
        loader.dismiss();
      },
      _ => {
        loader.dismiss();
        this.util.showToast(Dictionary.terjadi_kesalahan);
      }
    );

    // close modal
    this.btnClose();
  }
}
