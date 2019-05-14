import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdministrasiDetailPage } from './administrasi-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrasiDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdministrasiDetailPage]
})
export class AdministrasiDetailPageModule {}
