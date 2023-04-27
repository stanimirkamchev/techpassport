import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api/api.service';
import { ProductElement } from '@services/product/product.service';

@Component({
  selector: 'supplier-rapid-products',
  templateUrl: './supplier-rapid-products.component.html',
  styleUrls: ['./supplier-rapid-products.component.scss']
})
export class SupplierRapidProductsComponent implements OnInit {
  private productData: ProductElement[] = [];
  public productDisplayedColumns: string[] = ['name', 'status', 'rapid'];
  public productsDataSource = new MatTableDataSource(this.productData);
  private allRapidSet = false;

  private statusEnum = [
    { status: 'Draft', label: 'Draft', class: 'draft' },
    { status: 'Created', label: 'In Review', class: 'review' },
    { status: 'SentForApproval', label: 'In Review', class: 'review' },
    { status: 'Approved', label: 'Approved', class: 'complete' },
    { status: 'Rejected', label: 'Rejected', class: 'reject' }
  ];
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.apiService.getProducts()
      .subscribe((data: HttpResponse<Object>) => {
        let products = data.body as Array<Object>;
        this.productData = [];

        for (let p of products) {
          let status = (p as any).status[(p as any).status.length - 1].status;
          let statusClass;

          for (let i = 0; i < this.statusEnum.length; i++) {
            if (this.statusEnum[i].status === status) {
              status = this.statusEnum[i].label;
              statusClass = this.statusEnum[i].class;
              break
            }
          }
          let productElement: ProductElement = {
            position: this.productsDataSource.filteredData.length + 1,
            id: (p as any)._id, name: (p as any).name,
            assessments: (p as any).assessments,
            securityQuestions: (p as any).securityQuestions,
            statusHistory: (p as any).status,
            status: status,
            rapid: (p as any).rapidPOC,
            class: statusClass,
            actions: ''
          };
          this.productData.push(productElement);
        }
        this.productsDataSource = new MatTableDataSource(this.productData);
        this.rapidChange(null);
      }, (respError: Error) => {

      })
  }

  getProducts() {
    return this.productData.map(x => {
      return { _id: x.id, rapid: x.rapid };
    });
  }

  rapidChange(event) {
    for (let i = 0; i < this.productData.length; i++) {
      this.allRapidSet = false;
      if (this.productData[i].rapid !== 'no' && this.productData[i].rapid !== 'yes') {
        this.allRapidSet = false;
        return
      }
    }
    this.allRapidSet = true;
  }
  public isValid(): boolean {
    return this.allRapidSet || this.productData.length === 0
  }

}
