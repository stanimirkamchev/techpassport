import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { IProduct } from '../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ProductDeletionModalComponent } from '../product-deletion-modal/product-deletion-modal.component';

@Component({
  templateUrl: './products-list.component.html',
  selector: 'product-list',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent extends Destroyable implements OnInit {
  products: IProduct[] = [];
  files: File[] = [];
  isRemoving = false;
  isDuplicating = false;
  productId: any;

  constructor(
    private apiService: ApiService,
    public router: Router,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.apiService.getProducts().subscribe(res => {
      this.products = res.body;
      this.cdRef.detectChanges();
    });
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  getStatus(status: string) {
    switch (status) {
      case 'SentForApproval':
        return 'In Review';
      case 'Draft':
        return 'Draft';
      default:
        return status;
    }
  }

  getLastStatusByProduct(productStatuses: any) {
    const status = productStatuses.sort((a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return this.getStatus(status[status.length - 1].status);
  }

  onDuplicateProduct(product) {
    this.isDuplicating = true;
    this.productId = product._id;
    this.apiService.duplicateProduct(product._id).subscribe(() => {
      this.isDuplicating = false;
      this.getProducts();
      this.cdRef.detectChanges();
    }, () => {
      this.isDuplicating = false;
      this.cdRef.detectChanges();
    });
  }

  public onRemoveProduct(productId: string, name: string) {
    this.isRemoving = true;
    this.productId = productId;
    this.dialog.open(ProductDeletionModalComponent, {
      width: '350px',
      height: '125px',
      data: { productId, name }
    }).afterClosed().subscribe((responseFromUser: 'true' | 'false') => {
      if (responseFromUser === 'true') {
        this.apiService.removeProduct(productId).subscribe(() => {
          this.getProducts();
          this.isRemoving = false;
          this.cdRef.detectChanges();
        }, () => {
          this.isRemoving = false;
          this.cdRef.detectChanges();
        });
      }
      this.isRemoving = false;
      this.cdRef.detectChanges();
    });
  }
}
