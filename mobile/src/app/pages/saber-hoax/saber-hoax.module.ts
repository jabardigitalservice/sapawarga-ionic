import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SaberHoaxPage } from './saber-hoax.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [SaberHoaxPage],
  providers: [InAppBrowser]
})
export class SaberHoaxPageModule {}
