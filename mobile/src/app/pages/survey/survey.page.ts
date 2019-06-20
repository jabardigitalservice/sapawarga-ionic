import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import records from '../../../assets/data/survey';
import {
  InAppBrowser,
  InAppBrowserOptions
} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss']
})
export class SurveyPage implements OnInit {
  records: [];

  url =
    'http://35.247.135.93.xip.io:5001/view/#!/forms/5d038b3f5d65dc01009ef904';

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
    fullscreen: 'yes' // Windows only
  };

  constructor(private router: Router, private iab: InAppBrowser) {
    this.records = records;
  }

  ngOnInit() {}

  ionViewDidEnter() {}

  public openWithCordovaBrowser(url: string) {
    const target = '_self';
    this.iab.create(url, target, this.options);
  }

  // go to detail survey with param id
  goDetail(id: number) {
    this.router.navigate(['/survey', id]);
  }
}
