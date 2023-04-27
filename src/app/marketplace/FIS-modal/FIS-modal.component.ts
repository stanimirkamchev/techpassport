import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'FIS-modal',
  templateUrl: './FIS-modal.component.html',
  styleUrls: ['./FIS-modal.component.scss']
})
export class FISModalComponent implements OnInit {
  columns = [
    {
      label: 'Sector',
      value: 'sector'
    },
    {
      label: 'POC only',
      value: 'poc'
    },
    {
      label: 'Service agreements',
      value: 'serviceAgreements'
    },
    {
      label: 'Regional MSA',
      value: 'regional'
    },
    {
      label: 'Global MSA',
      value: 'global'
    },
  ];

  rows = [
    {
      sector: 'Banking - Tier 1'
    },
    {
      sector: 'Banking - Tier 2'
    },
    {
      sector: 'Banking - Tier 3'
    },
    {
      sector: 'Insurance'
    },
    {
      sector: 'Wealth Management'
    },
    {
      sector: 'Life Assurance '
    },
    {
      sector: 'Asset Management'
    },
  ];
  totalExperience = 0;

  constructor(public dialogRef: MatDialogRef<FISModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.rows.forEach(t => {
      this.columns.forEach((col: any) => {
        if(col.value !== 'sector') {
          t[col.value] = ""
        }
      })
    })
    const value = this.data || []
    this.totalExperience = 0;
    value.forEach(ex => {
      const rows = this.rows.find(t => t.sector === ex.sector)
      if(rows) {
        this.columns.forEach((col: any) => {
          if(col.value !== 'sector') {
            rows[col.value] = ex[col.value] || 0;
            this.totalExperience += Number(ex[col.value] || 0);
          }
        })
      }
    })
  }

  cancel() {
    this.dialogRef.close();
  }
}
