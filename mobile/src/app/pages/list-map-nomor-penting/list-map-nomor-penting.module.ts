import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListMapNomorPentingPage } from './list-map-nomor-penting.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

const routes: Routes = [
  {
    path: '',
    component: ListMapNomorPentingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [Diagnostic, OpenNativeSettings],
  declarations: [ListMapNomorPentingPage]
})
export class ListMapNomorPentingPageModule {}
