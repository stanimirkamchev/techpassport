import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ERQProgressService } from '../../../portal/enterprise-ready-questions/service/erq-proggress.service';
import {
  IApplicationSecurity,
  IBreachNotification,
  ICertification, IDeletionRetention, IEncryption,
  IPrivacy,
  IRecovery, ISsdlc,
  IStorageSeparation
} from '../../../portal/enterprise-ready-questions/models';
import { IErq } from '../../../portal/enterprise-ready-questions/models/erq';
import { ProductModalComponent } from '../../../portal/product-modal/product-modal.component';
import * as ERQModel from '../../../portal/enterprise-ready-questions/models';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'dashboard-watchlist-detail',
  templateUrl: './dashboard-watchlist-detail.component.html',
  styleUrls: ['./dashboard-watchlist-detail.component.scss']
})
export class DashboardWatchlistDetailComponent implements OnInit {
  @Input() watchLists = [];
  @Input() watchlistId = '';
  data: any[] = [];
  @Output() refresh = new EventEmitter();

  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    total: {
      completed: 0,
      compliant: 0
    }
  };

  constructor(
    private productDialog: MatDialog,
    private progressService: ERQProgressService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.data = this.watchLists.map((item) => {
      this.progressBar = { total: { completed: 0, compliant: 0 } };
      if (item.erq) {
        const erq = item.erq;
        const certification: ICertification = new ERQModel.Certification(erq.certification).data;
        const breachNotification: IBreachNotification = new ERQModel.BreachNotification(erq.breachNotification).data;
        const ssdlc: ISsdlc = new ERQModel.Ssdlc(erq.ssdlc).data;
        const applicationSecurity: IApplicationSecurity = new ERQModel.ApplicationSecurity(erq.applicationSecurity).data;
        const deletionRetention: IDeletionRetention = new ERQModel.DeletionRetention(erq.deletionRetention).data;
        const privacy: IPrivacy = new ERQModel.Privacy(erq.privacy).data;
        const storageSeparation: IStorageSeparation = new ERQModel.StorageSeparation(erq.storageSeparation).data;
        const recovery: IRecovery = new ERQModel.Recovery(erq.recovery).data;
        const encryption: IEncryption = new ERQModel.Encryption(erq.encryption).data;
        const erqData = {
          certification,
          breachNotification,
          ssdlc,
          applicationSecurity,
          deletionRetention,
          privacy,
          storageSeparation,
          recovery,
          encryption
        } as unknown as IErq;
        this.progressBar = this.progressService.calculateAlgorithm(erqData);
      }

      return ({
        name: item.name,
        company: item.supplierEntity.name,
        matchPercentage: 50,
        fundingRound: item.supplierEntity.companyStage,
        estTime: item.supplierEntity.incorporated,
        details: item.functionality,
        trialFee: item.productdetails?.charges?.trial !== 'free' || item.productdetails?.charges?.chargesTrialFee === 'yes',
        charges: item.productdetails?.charges,
        PIData: item.productdetails?.access?.personalDataTransfer,
        POCs: Array.isArray(item.supplierEntity?.experience)
          ? item.supplierEntity?.experience
            .map(subitem => Number(subitem.poc || 0))
            .reduce((sum, el) => sum + el, 0)
          : 0,
        fisWorkedWith: Array.isArray(item.supplierEntity?.experience)
          ? item.supplierEntity?.experience
            .map(subitem =>
              Number(subitem.global || 0) + Number(subitem.serviceAgreements || 0) + Number(subitem.regional || 0))
            .reduce((sum, el) => sum + el, 0)
          : 0,
        ratingProduct: 3,
        ratingERQ: 3,
        likes: 10,
        experience: item.supplierEntity.experience,
        companyAgeYear: Math.floor(item.companyAgeInYear),
        companyAgeMonth: Math.floor((item.companyAgeInYear - Math.floor(item.companyAgeInYear)) * 12),
        supplierId: item.supplierEntity._id,
        supplier: item.supplierEntity,
        id: item._id,
        compliant: this.progressBar.total.compliant.toFixed(0),
        productId: item._id,
      });
    });
  }

  openProductModal(row) {
    const ref = this.productDialog.open(ProductModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'product-modal',
      disableClose: false,
      data: { productId: row.productId }
    });
    ref.afterClosed().subscribe(() => {
      // after close
    });
  }

  removeProducts(productId) {
    this.apiService.removeProductsFromWatchlist([{
      watchlistId: this.watchlistId,
      productIds: [productId],
    }]).subscribe(() => {
      this.refresh.emit();
    });
  }

  roundNumber(val: number) {
    return Number(val).toFixed(0);
  }
}
