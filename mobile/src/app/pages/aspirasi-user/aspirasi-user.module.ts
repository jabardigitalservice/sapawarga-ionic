import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AspirasiUserPage } from './aspirasi-user.page';

const routes: Routes = [
  {
    path: '',
    component: AspirasiUserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AspirasiUserPage]
})
export class AspirasiUserPageModule {}
