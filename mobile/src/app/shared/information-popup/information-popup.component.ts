import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-popup',
  templateUrl: './information-popup.component.html',
  styleUrls: ['./information-popup.component.scss']
})
export class InformationPopupComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  goToDetail() {
    console.log('masuk detail');
  }
}
