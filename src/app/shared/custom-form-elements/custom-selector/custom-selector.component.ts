import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISelectorOption } from '@shared/models/ISelectorOption';

@Component({
  selector: 'custom-selector',
  templateUrl: './custom-selector.component.html',
  styleUrls: ['./custom-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectorComponent implements OnInit {
  @Input() label: string;
  @Input() formControlName?: string;
  @Input() formGroup?: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;
  @Input() options: ISelectorOption[];
  @Input() title: string;
  @Input() multiple: boolean;
  @Input() group: boolean;
  @Input() enableNewButton = false;
  @Input() enableSearchBox = false;
  @Input() readonly = false;
  @Output() onAddNew = new EventEmitter();

  constructor() { }
  ngOnInit(): void { }
}
