import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'slider-component',
  templateUrl: './slider-component.component.html',
  styleUrls: ['./slider-component.component.scss']
})
export class SliderComponentComponent implements OnInit {
  @Input() image = '';
  @Input() heading = '';
  @Input() paragraph = '';

  constructor() { }

  ngOnInit(): void {
  }

}
