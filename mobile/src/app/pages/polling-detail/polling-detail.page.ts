import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-polling-detail',
  templateUrl: './polling-detail.page.html',
  styleUrls: ['./polling-detail.page.scss']
})
export class PollingDetailPage implements OnInit {
  public items: any = [];

  constructor(private route: ActivatedRoute) {
    this.items = [
      {
        id: 1,
        title:
          'Seberapa puaskah anda terhadap pelayanan yang ada dari Pemerintah Provinsi Jawa Barat?',
        pollings: [
          {
            id: 1,
            name: 'Puas'
          },
          {
            id: 2,
            name: 'Biasa saja'
          },
          {
            id: 3,
            name: 'Kurang puas'
          }
        ],
        votes: 30
      },
      {
        id: 2,
        title:
          'Menurut anda apakah peran Pemerintah Daerah Provinsi Jawa Barat sudah cukup baik dalam mengelola harga bahan pokok?',
        pollings: [
          {
            id: 1,
            name: 'Baik'
          },
          {
            id: 2,
            name: 'Cukup'
          },
          {
            id: 3,
            name: 'Kurang'
          }
        ],
        votes: 30
      },
      {
        id: 3,
        title:
          'Menurut anda apakah implementasi teknologi pada layanan Pemerintah Provinsi Jawa Barat dapat memberikan pengaruh yang baik dalam peningkatan layanan pemerintahan terhadap masyarakat?',
        pollings: [
          {
            id: 1,
            name: 'Ya, sangat berpengaruh'
          },
          {
            id: 2,
            name: 'Tidak berpengaruh'
          }
        ],
        votes: 30
      }
    ];
  }

  id: number;
  ngOnInit() {
    // get id detail instansion
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });
  }
}
