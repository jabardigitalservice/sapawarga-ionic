import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { NotifikasiPage } from './notifikasi.page';

const routes: Routes = [
  {
    path: '',
    component: NotifikasiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [InAppBrowser],
  declarations: [NotifikasiPage]
})
export class NotifikasiPageModule {}
