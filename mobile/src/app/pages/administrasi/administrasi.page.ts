import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrasi',
  templateUrl: './administrasi.page.html',
  styleUrls: ['./administrasi.page.scss'],
})
export class AdministrasiPage {
  content = [
    {
      data: 'Syarat Pembuatan Kartu Keluarga'
    },
    {
      data: 'Syarat Pembuatan KTP'
    },
    {
      data: 'Syarat Pembuatan Akte Kelahiran'
    },
    {
      data: 'Syarat Pembuatan SKCK'
    },
    {
      data: 'Syarat Pembuatan Surat Kematian'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
