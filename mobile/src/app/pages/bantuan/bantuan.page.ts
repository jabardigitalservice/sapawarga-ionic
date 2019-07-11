import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bantuan',
  templateUrl: './bantuan.page.html',
  styleUrls: ['./bantuan.page.scss']
})
export class BantuanPage implements OnInit {
  @ViewChild('content') private content: any;

  public items: any = [];
  constructor(private route: ActivatedRoute) {
    this.items = [
      {
        id: 1,
        title: 'Bagaimana caranya masuk ke akun Sapawarga saya?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Sudah punya akun? Segera masuk ke akun Sapawarga untuk nikmati semua layanannya! Ikuti langkah berikut:</p> <p>1. Buka aplikasi Sapawarga</p> <p>2. Masukkan username dan password yang telah diberikan</p> <p>3. Pilih tombol Masuk</p>',
        expanded: false
      },
      {
        id: 2,
        title: 'Bagaimana cara melihat nomor penting di sekitar lokasi saya?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Anda dapat menemukan nomor-nomor instansi penting yang lokasinya ada di sekitar Anda. Caranya:</p> <p>1. Sebelum menggunakan menu ini, sebaiknya aktifkan dulu GPS pada handphone Anda.</p> <p>2. Pilih menu Nomor Penting</p> <p>3. Pilih ikon Lokasi yang terdapat di samping ikon Search</p>',
        expanded: false
      },
      {
        id: 3,
        title: 'Bagaimana cara melihat detail lokasi pada nomor penting? ',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Untuk melihat detail lokasi instansi yang terdaftar di fitur Nomor Penting, ikuti langkah berikut:</p> <p>1. Pilih menu Nomor Penting</p> <p>2. Pilih nomor yang Anda ingin dilihat detailnya</p> <p>3. Tap ikon Lokasi.</p> <p>4. Untuk melihat ikon Lokasi, Anda harus menyalakan GPS terlebih dahulu. Jika GPS belum diaktifkan maka akan muncul pesan konfirmasi untuk menyalakan GPS.</p>',
        expanded: false
      },
      {
        id: 4,
        title: 'Bagaimana cara memperbarui profil akun saya?  ',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Untuk memperbarui profil akun, caranya:</p> <p>1. Piliih menu Akun</p> <p>2. Pilih opsi Menu</p> <p>3. Pilih menu Edit akun</p>',
        expanded: false
      },
      {
        id: 5,
        title: 'Bagaimana cara memperbarui aspirasi yang sudah dibuat?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Aspirasi yang telah dibuat dapat diperbarui atau diperbaiki jika statusnya adalah Draft. Caranya:</p> <p>1. Pilih menu Aspirasi</p> <p>2. Pilih menu Aspirasi pribadi</p> <p>3. Pilih aspirasi yang ingin diperbaiki (status aspirasi draft).</p>',
        expanded: false
      },
      {
        id: 6,
        title:
          'Bagaimana jika ada kendala tidak dapat mengakses fitur pada Aplikasi Sapawarga?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Ada dapat menghubungi call center dengan nomor <a href="tel:08943091801"><strong>08943091801</strong></a> atau melalui email <a href="mailto:digital.service@jabarprov.go.id"><strong>digital.service@jabarprov.go.id</strong></a></p>',
        expanded: false
      }
    ];
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.route.queryParamMap.subscribe(params => {
      if (params['params']['data']) {
        const infoError = this.items.find((x: any) => x.id === 6);
        this.expandItem(infoError);
        setTimeout(() => {
          this.scrollToBottomOnInit();
        }, 500);
      }
    });
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item === listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(500);
  }
}
