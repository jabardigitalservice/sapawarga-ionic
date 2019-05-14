import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BantuanPage } from './bantuan.page';
import { ExpandableComponent } from '../../components/expandable/expandable.component';

const routes: Routes = [
  {
    path: '',
    component: BantuanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BantuanPage, ExpandableComponent]
})
export class BantuanPageModule {}
