import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-control',
  templateUrl: './message-control.component.html',
  styleUrls: ['./message-control.component.scss']
})
export class MessageControlComponent implements OnInit {
  @Input() type: string;
  @Input() message: string;

  constructor(private navCtrl: NavController, private router: Router) {}

  ngOnInit() {}

  goToHelp(data: boolean) {
    // this.navCtrl.navigateForward(['tabs/bantuan', data]);
    this.router.navigate(['tabs/bantuan'], {
      queryParams: { data }
    });
  }
}
