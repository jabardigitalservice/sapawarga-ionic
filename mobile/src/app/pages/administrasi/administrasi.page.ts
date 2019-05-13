import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrasi',
  templateUrl: './administrasi.page.html',
  styleUrls: ['./administrasi.page.scss'],
})
export class AdministrasiPage {
  content = [
    {
      id: 1,
      data: 'Syarat Pembuatan Kartu Keluarga'
    },
    {
      id: 2,
      data: 'Syarat Pembuatan KTP'
    },
    {
      id: 3,
      data: 'Syarat Pembuatan Akte Kelahiran'
    },
    {
      id: 4,
      data: 'Syarat Pembuatan SKCK'
    },
    {
      id: 5,
      data: 'Syarat Pembuatan Surat Kematian'
    },
  ]

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToDetail(id: number) {
    this.router.navigate(['/administrasi', id]);
  }

}
