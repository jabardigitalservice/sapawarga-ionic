import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageControlComponent } from './message-control/message-control.component';
import { AspirasiListComponent } from './aspirasi-list/aspirasi-list.component';
import { MyAspirasiComponent } from './my-aspirasi/my-aspirasi.component';
import { ForceChangePasswordComponent } from './force-change-password/force-change-password.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForceChangeProfileComponent } from './force-change-profile/force-change-profile.component';

@NgModule({
  declarations: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent,
    ForceChangePasswordComponent,
    ForceChangeProfileComponent
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent
  ],
  entryComponents: [ForceChangePasswordComponent, ForceChangeProfileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
