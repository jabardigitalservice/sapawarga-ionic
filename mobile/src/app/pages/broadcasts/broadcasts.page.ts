import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../services/broadcast.service';
import { LoadingController } from '@ionic/angular';
import { Broadcast } from '../../interfaces/broadcast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcasts',
  templateUrl: './broadcasts.page.html',
  styleUrls: ['./broadcasts.page.scss']
})
export class BroadcastsPage implements OnInit {
  dataBroadcast: Broadcast[];
  dataRead = [];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;

  constructor(
    private broadcastService: BroadcastService,
    public loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.dataRead = this.broadcastService.getlocalBroadcast() || [];
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getNomorBroadcasts();
  }

  // get data broadcasts
  async getNomorBroadcasts() {
    // check internet
    if (!navigator.onLine) {
      alert('Tidak ada jaringan internet');
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.dataEmpty = false;

    this.broadcastService.getListBroadCasts().subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataBroadcast = res['data']['items'];
        } else {
          this.dataEmpty = true;
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      }
    );
  }

  // go to detail broadcast with param id
  goDetail(broadcast: Broadcast) {
    // add to list dataRead
    if (this.checkRead(broadcast.id) === false) {
      const data = {
        id: broadcast.id,
        read: true
      };
      this.dataRead.push(data);
      // to dataRead to local storage
      this.broadcastService.saveBroadcast(JSON.stringify(this.dataRead));
    }
    // console.log(broadcast);
    this.router.navigate(['/broadcast', broadcast.id], {
      queryParams: {
        id: broadcast.id,
        author: broadcast.author.name,
        title: broadcast.title,
        category_name: broadcast.category.name,
        description: broadcast.description,
        updated_at: broadcast.updated_at
      }
    });
  }

  // check if data isRead/UnRead
  checkRead(id: number) {
    return this.dataRead.filter(x => x.id === id).length > 0;
  }
}
