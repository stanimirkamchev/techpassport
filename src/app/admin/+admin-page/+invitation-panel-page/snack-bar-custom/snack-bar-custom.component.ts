import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'snack-bar-custom',
  templateUrl: './snack-bar-custom.component.html',
  styleUrls: ['./snack-bar-custom.component.scss']
})
export class SnackBarCustomComponent implements OnInit {

  constructor() {}

  @Input() color: string;
  @Input() msg: string;
  @Output() closeSnackBar = new EventEmitter<{}>();

  ngOnInit(): void {
  }
}
