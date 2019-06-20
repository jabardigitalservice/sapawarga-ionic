import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent implements OnInit {
  @ViewChild('expandWrapper', { read: ElementRef }) expandWrapper: ElementRef;
  @Input() expanded = false;

  constructor(public renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, 'height', 'auto');
  }
}
