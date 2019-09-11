import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageControlComponent } from './message-control/message-control.component';
import { AspirasiListComponent } from './aspirasi-list/aspirasi-list.component';
import { MyAspirasiComponent } from './my-aspirasi/my-aspirasi.component';

@NgModule({
  declarations: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent
  ],
  imports: [CommonModule],
  exports: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
