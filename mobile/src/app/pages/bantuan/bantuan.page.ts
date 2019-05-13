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
          '<p>Jawab :<br />Sudah punya akun Sapawarga? Langsung masuk ke akun Sapawarga buat nikmatin semua layanannya, ikuti langkah berikut ya:<br />a. Buka aplikasi sapawarga<br />b. Masukkan username dan password yang telah diberikan.<br />c. Pilih tombol Masuk</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara melihat nomor penting di sekitar lokasi saya?',
        description:
          '<p>Jawab :<br />Kamu dapat melihat lokasi instansi yang nomornya terdapat pada nomor penting di sekitar kamu. <br />Caranya adalah :<br />a. Sebelum menggunakan menu ini, sebaiknya aktifkan dulu GPS pada handphone.<br />b. Pilih menu Nomor Penting<br />c. Pilih Icon Lokasi yang terdapat di samping icon search.</p>',
        expanded: false
      },
      {
        title: 'Bagaiamana cara melihat detail lokasi pada nomor penting? ',
        description:
          '<p>Jawab :<br />Untuk melihat detail lokasi instansi pada nomor penting, bisa mengikuti langkah berikut :<br />a. Pilih menu Nomor Penting<br />b. Pilih Nomor yang ingin dilihat detailnya.<br />c. Tap Icon Lokasi.<br />d. Untuk melihat icon lokasi anda harus menyalakan GPS terlebih dahulu, Jika GPS belum diaktifkan maka akan muncul pesan konfirmasi untuk menyalakan GPS.</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara mengupdate profile akun saya?',
        description:
          '<p>Jawab :<br />Untuk mengupdate profile akun, caranya adalah :<br />a. Piliih menu akun<br />b. Pilih option menu<br />c. Pilih menu edit akun</p>',
        expanded: false
      },
      {
        title: 'Bagaimana cara mengupdate aspirasi yang sudah dibuat?',
        description:
          '<p>Aspirasi yang telah dibuat dapat diupdate atau diedit jika statusnya adalah draft. Caranya adalah :<br />a. Pilih menu aspirasi<br />b. Pilih menu aspirasi pribadi<br />c. Pilih aspirasi yang ingin di update (status aspirasi draft).</p>',
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
