import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-info',
  templateUrl: './list-info.component.html',
  styleUrls: ['./list-info.component.scss']
})
export class ListInfoComponent implements OnInit {

  constructor() { }

  @Input() prices: object[];

  ngOnInit(): void {
  }
}
