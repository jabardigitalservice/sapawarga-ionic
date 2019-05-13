import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AspirasiDetailPage } from './aspirasi-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AspirasiDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AspirasiDetailPage]
})
export class AspirasiDetailPageModule {}
