import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-activity-rw-form',
  templateUrl: './activity-rw-form.component.html',
  styleUrls: ['./activity-rw-form.component.scss']
})
export class ActivityRwFormComponent implements OnInit {
  image = {
    type: null,
    path: null,
    url: null
  };

  constructor(private navParams: NavParams) {
    this.image = this.navParams.get('image');
  }

  ngOnInit() {}
}
