import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-control',
  templateUrl: './message-control.component.html',
  styleUrls: ['./message-control.component.scss']
})
export class MessageControlComponent implements OnInit {
  @Input() type: string;
  @Input() message: string;

  constructor() {}

  ngOnInit() {}
}
