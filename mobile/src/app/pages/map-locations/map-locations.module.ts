import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapLocationsPage } from './map-locations.page';

// plugin
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

const routes: Routes = [
  {
    path: '',
    component: MapLocationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [Diagnostic],
  declarations: [MapLocationsPage]
})
export class MapLocationsPageModule {}
