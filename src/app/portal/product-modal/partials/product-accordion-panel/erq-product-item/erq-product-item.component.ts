import { Component, Input, OnInit } from '@angular/core';
import { ErqType } from 'src/app/portal/enterprise-ready-questions/models/erq';
import { ProductModalService } from '../../../service/product-modal.service';

type ErqTab = {
  certification: boolean,
  breach: boolean,
  ssdlc: boolean,
  charges: boolean,
  security: boolean,
  deletion: boolean,
  privacy: boolean,
  storage: boolean,
  recovery: boolean,
  encryption: boolean,
};

@Component({
  selector: 'erq-product-item',
  templateUrl: './erq-product-item.component.html',
  styleUrls: ['./erq-product-item.component.scss']
})
export class ErqProductItemComponent implements OnInit {

  constructor(private productModalService: ProductModalService) {
  }

  @Input() payload: any;
  @Input() progressBar: { [key: string]: { completed: number, compliant: number } };
  erqType = ErqType;

  public expandedTabs: ErqTab = {
    certification: false,
    breach: false,
    ssdlc: false,
    charges: false,
    security: false,
    deletion: false,
    privacy: false,
    storage: false,
    recovery: false,
    encryption: false,
  };

  ngOnInit(): void {
  }

  modalWindowExpansion = () => this.productModalService.modalWindowExpansion();
}
