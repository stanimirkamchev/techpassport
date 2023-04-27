import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBase } from '../../../product-base.component';
import { ProductModalService } from '../../../service/product-modal.service';

@Component({
  selector: 'fisworked',
  templateUrl: './fisworked.component.html',
  styleUrls: ['./fisworked.component.scss']
})
export class FisworkedComponent extends ProductBase implements OnInit {
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
  rows: any[] = [
    {
      sector: 'Banking - Tier 1',
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

  @Input() payload: any;
  isExpanded$: Observable<boolean>;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void {
    // TODO: Nikola: experience -> the values from the existing products are different
    if (!this.payload.supplier.experience || !Array.isArray(this.payload.supplier.experience)) {
      const na = 'N/A';
      const defaultData = {
        poc: na,
        serviceAgreements: na,
        regional: na,
        global: na
      };
      this.rows = [
        { sector: 'Banking - Tier 1', ...defaultData },
        { sector: 'Banking - Tier 2', ...defaultData },
        { sector: 'Insurance', ...defaultData },
        { sector: 'Wealth Management', ...defaultData },
        { sector: 'Life Assurance', ...defaultData },
        { sector: 'Asset Management', ...defaultData },
      ];
      this.totalExperience = 0;
    } else {
      this.rows = this.payload.supplier.experience;

      this.rows.forEach((row: any) => {
        for (const key of Object.keys(row)) {
          if (key !== 'sector') {
            this.totalExperience += (Number(row[key]) || 0);
          }
        }
      });
    }

    this.isExpanded$ = this.productModalService.modalExpanded$;
  }
}
