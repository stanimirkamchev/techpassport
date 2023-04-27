import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() formControlName: string;
  @Input() formGroup?: FormGroup;

  constructor() { }
  ngOnInit(): void { }

}
