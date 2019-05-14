import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import records from '../../../assets/data/survey';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  records: [];

  constructor(
      private router: Router
  ) {
    this.records = records;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //
  }

  // go to detail with param id
  goDetail(id: number) {
    this.router.navigate(['/survey', id]);
  }
}
