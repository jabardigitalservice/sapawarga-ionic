import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from 'src/app/helpers/dictionary';
import { SaberHoax } from '../../interfaces/saber-hoax';
import { Constants } from '../../helpers/constants';
import { SaberHoaxService } from '../../services/saber-hoax.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-saber-hoax-detail',
  templateUrl: './saber-hoax-detail.page.html',
  styleUrls: ['./saber-hoax-detail.page.scss']
})
export class SaberHoaxDetailPage implements OnInit {
  id = 0;
  dataSaberHoax: SaberHoax;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private route: ActivatedRoute,
    private constants: Constants,
    private saberHoaxService: SaberHoaxService,
    private util: UtilitiesService
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getDetailSaberHoax(this.id);
    });
  }

  ionViewWillLeave() {
    this.msgResponse = {
      type: '',
      msg: ''
    };
  }

  async getDetailSaberHoax(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.dataSaberHoax = null;

    this.saberHoaxService.getDetailSaberHoax(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataSaberHoax = res['data'];

          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.saberHoax,
            'view_detail_saber_hoax',
            this.dataSaberHoax.title,
            1
          );
        }
      },
      err => {
        if (err.status === 404) {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
      }
    );
  }
}
