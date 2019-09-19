import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SaberHoaxPage } from './saber-hoax.page';

const routes: Routes = [
  {
    path: '',
    component: SaberHoaxPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SaberHoaxPage]
})
export class SaberHoaxPageModule {}
