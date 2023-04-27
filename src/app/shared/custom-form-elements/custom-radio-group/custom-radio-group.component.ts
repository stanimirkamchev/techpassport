import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICheckboxOptions } from '@shared/models/checbox.options';
@Component({
  selector: 'custom-radio-group',
  templateUrl: './custom-radio-group.component.html',
  styleUrls: ['./custom-radio-group.component.scss']
})
export class CustomRadioGroupComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() formControlName: string;
  @Input() items: ICheckboxOptions[];
  constructor() { }
  ngOnInit(): void { }
}
