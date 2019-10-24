import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-aspirasi',
  templateUrl: './aspirasi.page.html',
  styleUrls: ['./aspirasi.page.scss']
})
export class AspirasiPage implements OnInit {
  currentComponent: string;
  lastComponent: string;
  isPushNotification = false;

  constructor(
    public loadingCtrl: LoadingController,
    private router: Router,
    private util: UtilitiesService,
    private constants: Constants,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.usulan);

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewDidEnter() {
    if (this.lastComponent) {
      this.segmentChanged('', this.lastComponent);
    }
  }

  ionViewDidLeave() {
    this.lastComponent = this.currentComponent;
    this.currentComponent = null;
  }

  segmentChanged(ev: any, current?: string) {
    this.currentComponent = ev ? ev.detail.value : current;
  }

  AddAspirasi() {
    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }
    this.router.navigate(['/aspirasi-form']);
  }
}
