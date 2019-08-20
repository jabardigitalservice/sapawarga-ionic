import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import records from '../../../assets/data/administrasi';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-administrasi',
  templateUrl: './administrasi.page.html',
  styleUrls: ['./administrasi.page.scss']
})
export class AdministrasiPage implements OnInit {
  records: [];

  constructor(
    private router: Router,
    private util: UtilitiesService,
    public constants: Constants
  ) {
    this.records = records;
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.administration);

    this.util.trackEvent(
      this.constants.pageName.administration,
      'view_all_administrasi',
      '',
      1
    );
  }

  goToDetail(id: number) {
    this.router.navigate(['/administrasi', id]);
  }
}
