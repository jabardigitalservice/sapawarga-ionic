import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AspirasiService } from '../../services/aspirasi.service';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-menu-navbar-aspirasi',
  templateUrl: './menu-navbar-aspirasi.component.html',
  styleUrls: ['./menu-navbar-aspirasi.component.scss']
})
export class MenuNavbarAspirasiComponent implements OnInit {
  constructor(
    private navParams: NavParams,
    private router: Router,
    private popover: PopoverController,
    private aspirasiService: AspirasiService,
    private util: UtilitiesService
  ) {}

  ngOnInit() {}

  editAspirasi() {
    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    this.router.navigate(['aspirasi-form'], {
      queryParams: {
        data: JSON.stringify(this.navParams.get('dataAspirasi'))
      }
    });
    this.popover.dismiss();
  }

  deleteAspirasi() {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const id = this.navParams.get('dataAspirasi').id;
    this.aspirasiService.deleteAspirasi(id).subscribe(
      res => {
        this.util.showToast(Dictionary.aspirasi_success_delete);

        this.router.navigate(['aspirasi']);
        this.popover.dismiss();
      },
      err => {
        this.util.showToast(Dictionary.aspirasi_failed);
        this.popover.dismiss();
      }
    );
  }

  confirmDeleteAspirasi() {
    const buttons = [
      {
        text: 'Batalkan',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          this.popover.dismiss();
        }
      },
      {
        text: 'Ok',
        handler: () => {
          this.deleteAspirasi();
        }
      }
    ];

    this.util.alertConfirmation(Dictionary.aspirasi_confirm, buttons);
  }
}
