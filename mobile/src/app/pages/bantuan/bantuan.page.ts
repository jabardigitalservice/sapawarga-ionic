import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bantuan',
  templateUrl: './bantuan.page.html',
  styleUrls: ['./bantuan.page.scss']
})
export class BantuanPage implements OnInit {
  public items: any = [];
  constructor() {
    this.items = [
      {
        title: 'Bagaimana caranya masuk ke akun Sapawarga saya?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Sudah punya akun? Segera masuk ke akun Sapawarga untuk nikmati semua layanannya! Ikuti langkah berikut:</p> <p>1. Buka aplikasi Sapawarga</p> <p>2. Masukkan username dan password yang telah diberikan</p> <p>3. Pilih tombol Masuk</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara melihat nomor penting di sekitar lokasi saya?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Anda dapat menemukan nomor-nomor instansi penting yang lokasinya ada di sekitar Anda. Caranya:</p> <p>1. Sebelum menggunakan menu ini, sebaiknya aktifkan dulu GPS pada handphone Anda.</p> <p>2. Pilih menu Nomor Penting</p> <p>3. Pilih ikon Lokasi yang terdapat di samping ikon Search</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara melihat detail lokasi pada nomor penting? ',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Untuk melihat detail lokasi instansi yang terdaftar di fitur Nomor Penting, ikuti langkah berikut:</p> <p>1. Pilih menu Nomor Penting</p> <p>2. Pilih nomor yang Anda ingin dilihat detailnya</p> <p>3. Tap ikon Lokasi.</p> <p>4. Untuk melihat ikon Lokasi, Anda harus menyalakan GPS terlebih dahulu. Jika GPS belum diaktifkan maka akan muncul pesan konfirmasi untuk menyalakan GPS.</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara memperbarui profil akun saya?  ',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Untuk memperbarui profil akun, caranya:</p> <p>1. Piliih menu Akun</p> <p>2. Pilih opsi Menu</p> <p>3. Pilih menu Edit akun</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara memperbarui aspirasi yang sudah dibuat?',
        description:
          // tslint:disable-next-line:max-line-length
          '<p>Jawab :</p> <p>Aspirasi yang telah dibuat dapat diperbarui atau diperbaiki jika statusnya adalah Draft. Caranya:</p> <p>1. Pilih menu Aspirasi</p> <p>2. Pilih menu Aspirasi pribadi</p> <p>3. Pilih aspirasi yang ingin diperbaiki (status aspirasi draft).</p>',
        expanded: false
      }
    ];
  }

  ngOnInit() {}

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
}
