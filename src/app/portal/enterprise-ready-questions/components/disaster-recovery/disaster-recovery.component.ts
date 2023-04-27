import { Component, OnInit } from '@angular/core';
import { ISelectorOption } from '@shared/models/ISelectorOption';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-disaster-recovery',
  templateUrl: './disaster-recovery.component.html',
  styleUrls: ['./disaster-recovery.component.scss']
})
export class DisasterRecoveryComponent implements OnInit {
  formGroup: FormGroup;
  criticality = false;
  criticalityOptions: ISelectorOption[] = [
    {
      label: 'high risk',
      value: 'high risk',
    },
    {
      label: 'low risk',
      value: 'low risk',
    },
    {
      label: 'unknown',
      value: 'unknown',
    }
  ];

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
    if (!this.formGroup.get('criticality').value) {
      this.formGroup.get('criticality').setValue('unknown');
    }
    this.criticality = this.formGroup.get('criticality').value === 'high risk' ? true : false;

    this.formGroup.get('criticality').valueChanges.subscribe(x => {
      if (x === 'high risk') {
        this.criticality = true;
      } else {
        this.criticality = false;
        this.formGroup.get('recoveryTime').setValue(null);
      }
    });
  }

}
