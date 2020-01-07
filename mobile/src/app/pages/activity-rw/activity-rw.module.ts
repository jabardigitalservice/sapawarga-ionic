import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActivityRwPage } from './activity-rw.page';
import { SharedModule } from '../../shared/shared.module';
import { ActivityRwFormComponent } from '../../shared/activity-rw-form/activity-rw-form.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityRwPage
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
  entryComponents: [ActivityRwFormComponent],
  declarations: [ActivityRwPage]
})
export class ActivityRwPageModule {}
