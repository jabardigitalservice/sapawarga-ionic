import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MessageControlComponent } from './message-control/message-control.component';
import { AspirasiListComponent } from './aspirasi-list/aspirasi-list.component';

@NgModule({
  declarations: [MessageControlComponent, AspirasiListComponent],
  imports: [CommonModule],
  exports: [MessageControlComponent, AspirasiListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
