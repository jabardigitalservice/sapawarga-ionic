import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import records from '../../../assets/data/administrasi';

@Component({
  selector: 'app-administrasi',
  templateUrl: './administrasi.page.html',
  styleUrls: ['./administrasi.page.scss'],
})
export class AdministrasiPage {
  records: [];

  constructor(
    private router: Router
  ) {
    this.records = records;
   }

  goToDetail(id: number) {
    this.router.navigate(['/administrasi', id]);
  }

}
