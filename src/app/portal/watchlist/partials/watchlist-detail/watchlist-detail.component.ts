import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  IApplicationSecurity,
  IBreachNotification,
  ICertification, IDeletionRetention, IEncryption, IPrivacy, IRecovery,
  ISsdlc, IStorageSeparation
} from '../../../enterprise-ready-questions/models';
import * as ERQModel from '../../../enterprise-ready-questions/models';
import { IErq } from '../../../enterprise-ready-questions/models/erq';
import { ERQProgressService } from '../../../enterprise-ready-questions/service/erq-proggress.service';
import { ProductModalComponent } from '../../../product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FISModalComponent } from '../../../../marketplace/FIS-modal/FIS-modal.component';
import { SelectionModel } from '@angular/cdk/collections';
import { WatchListService } from '../../service';
import { Observable } from 'rxjs';

import * as moment from 'moment';

@Component({
  selector: 'watchlist-detail',
  templateUrl: './watchlist-detail.component.html',
  styleUrls: ['./watchlist-detail.component.scss']
})
export class WatchlistDetailComponent implements OnInit {
  @Input() products = [];
  @Input() watchListId = '';
  @Input() selectable = false;
  @Input() watchlistId: string;
  @Output() select = new EventEmitter();

  dataSource = new MatTableDataSource<any>();
  selection: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectedProductCount$: Observable<number>;
  displayedColumns = [
    'icon',
    'product',
    'details',
    'fundingRound',
    'trialfee',
    'pidata',
    'poc',
    'fisWorkedWith',
    // 'ratings',
    'action'
  ];
  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    total: {
      completed: 0,
      compliant: 0
    }
  };

  selectedProductIds: { watchlistId: string, productIds: string[] }[] = [];

  constructor(
    private productDialog: MatDialog,
    private progressService: ERQProgressService,
    private watchListService: WatchListService,
  ) { }

  ngOnInit(): void {
    this.watchListService.selectedProductIdsOverview$.subscribe((res) => {
      this.selectedProductIds = res;
    });

    this.watchListService.clearAll$.subscribe((res) => {
      if (res) {
        this.watchListService.setClearProductIds(false);
        this.selection = new SelectionModel<any>(true, []);
      }
    });

    this.selectedProductCount$ = this.watchListService.selectedProductCount$;
    this.dataSource.data = this.products.map((item) => {
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
        POCs: item.pocCount,
        fisWorkedWith: Array.isArray(item.supplierEntity?.experience)
          ? item.supplierEntity?.experience
            .map(subitem =>
              Number(subitem.global || 0) + Number(subitem.serviceAgreements || 0) + Number(subitem.regional || 0) + Number(subitem.poc || 0))
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
        isRecentlyUpdated: moment().diff(moment(item.updatedAt), 'week') <= 2,
        watchlistsCount: item.watchlistsCount
      });
    });
  }

  openFISDialog(element) {
    const ref = this.productDialog.open(FISModalComponent, {
      width: '1200px',
      height: '676px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: element.experience
    });
    ref.afterClosed().subscribe(() => { });
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

  roundNumber(val: number) {
    return Number(val).toFixed(0);
  }

  onSelect($event: MatCheckboxChange, row: any) {
    const { checked } = $event;
    const productId = row.productId;
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
    this.select.emit({ watchListId: this.watchListId, id: productId });
  }

  onToggle(row: any) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }
    this.select.emit({ watchListId: this.watchListId, id: row.productId });
  }

  isSelected(productId: string) {
    const watchlist = this.selectedProductIds.find((item) => item.watchlistId === this.watchlistId);

    if (!watchlist) { return false; }

    return watchlist.productIds.includes(productId);
  }
}
