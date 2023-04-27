import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBase } from '../../../product-base.component';
import { ProductModalService } from '../../../service/product-modal.service';

@Component({
  selector: 'company-diversity',
  templateUrl: './company-diversity.component.html',
  styleUrls: ['./company-diversity.component.scss']
})
export class CompanyDiversityComponent extends ProductBase implements OnInit {

  @Input() payload: any;
  isExpanded$: Observable<boolean>;
  genderDiversityColumns = [
    {
      label: '',
      value: 'label',
    },
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Other',
      value: 'other',
    }
  ];

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  getGenderDiversityRows(supplier: any) {
    return [
      {
        label: 'Founders',
        ...supplier.founders
      },
      {
        label: 'Board of Directors',
        ...supplier.boardMembers
      }
    ];
  }

  toReadableText(text: string) {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  ngOnInit(): void {
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }

}
