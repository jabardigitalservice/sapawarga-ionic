import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-message-control',
  templateUrl: './message-control.component.html',
  styleUrls: ['./message-control.component.scss']
})
export class MessageControlComponent implements OnInit {
  @Input() type: string;
  @Input() message: string;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goToHelp(data: boolean) {
    this.navCtrl.navigateForward('tabs/bantuan');
  }
}
