import { Component, Input, OnInit } from '@angular/core';
import { VideoModalComponent } from '../../../video-modal/video-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductBase } from '../../product-base.component';
import { ProductModalService } from '../../service/product-modal.service';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'product-basic-details',
  templateUrl: './product-basic-details.component.html',
  styleUrls: ['./product-basic-details.component.scss']
})
export class ProductBasicDetailsComponent extends ProductBase implements OnInit {

  constructor(
    private addDialog: MatDialog,
    private apiService: ApiService,
    public productModalService: ProductModalService
  ) {
    super(productModalService);
  }

  @Input() productId: string;
  @Input() details: any;
  @Input() collateral: [];
  @Input() supplier: any;
  @Input() projectDetail: any;
  @Input() compliant: any;

  public isReadMore = true;

  ngOnInit(): void {
  }

  readMore() {
    this.isReadMore = !this.isReadMore;
  }

  roundNumber(val: any) {
    return Number(val).toFixed(0);
  }

  openVideoModal() {
    const videoUrl = this.getVidUrl();
    const ref = this.addDialog.open(VideoModalComponent, {
      width: '600px',
      height: '400px',
      maxWidth: undefined,
      panelClass: 'video-modal',
      disableClose: false,
      data: { url: videoUrl }
    });
    ref.afterClosed().subscribe(result => {
      // after close
    });
  }

  private getVidUrl() {
    return `/api/v1/product/${this.productId}/video/frame`;
  }

  checkCollateral(collateral: any[], len: number) {
    return collateral && collateral.length >= len;
  }

  downloadCollateral(collateral: any[], index: number) {
    const key = collateral[index].file;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.apiService.getFileUrl(key);
    a.download = key;
    a.click();
  }

}
