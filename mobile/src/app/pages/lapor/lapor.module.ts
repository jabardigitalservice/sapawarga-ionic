import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LaporPage } from './lapor.page';

// plugin
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const routes: Routes = [
  {
    path: '',
    component: LaporPage
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
  declarations: [LaporPage]
})
export class LaporPageModule {}
