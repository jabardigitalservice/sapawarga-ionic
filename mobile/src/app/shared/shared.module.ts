import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MessageControlComponent } from './message-control/message-control.component';

@NgModule({
  declarations: [MessageControlComponent],
  imports: [CommonModule],
  exports: [MessageControlComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
