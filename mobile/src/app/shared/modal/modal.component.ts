import { Component, OnInit } from '@angular/core';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  msgApdate = Dictionary.msg_update_app;

  constructor() {}

  ngOnInit() {}
}
