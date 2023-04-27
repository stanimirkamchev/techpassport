import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErqType, IErq } from '../../models/erq';
import { IErqDto } from '../../models/erq-dto';
import { ERQProgressService } from '../../service/erq-proggress.service';
import * as ERQSelectors from '../../store/index.selector';
import * as ERQActions from '../../store/index.actions';
import { Destroyable } from '@abstract/destroyable';
import * as ERQModel from '../../models';
import { IApplicationSecurity, IBreachNotification, ICertification, IDeletionRetention, IEncryption, IPrivacy, IRecovery, ISsdlc, IStorageSeparation } from '../../models';

type Equation = { completed: number, compliant: number };
type ProgressBar = { [key: string]: Equation };

@Component({
  selector: 'erq-overview',
  templateUrl: './erq-overview.component.html',
  styleUrls: ['./erq-overview.component.scss']
})
export class ErqOverviewComponent extends Destroyable implements OnInit {
  loading = false;
  step = 0;
  dataSource: any[] = [];
  loaded = false;
  erqEntity: IErqDto = {} as IErqDto;
  progressBar: { [key: string]: { completed: number, compliant: number } } = {};
  erqType = ErqType;
  @Output() changeProgressBar = new EventEmitter<ProgressBar>();

  constructor(
    private store: Store,
    private progressService: ERQProgressService,
    public ref: ChangeDetectorRef,
  ) {
    super();
    this.store.dispatch(ERQActions.loadDataTable());
    this.initProgressbar();
  }

  ngOnInit(): void {
    this.populateData();
  }

  private populateData() {
    this.store.select(ERQSelectors.selectERQState).subscribe((responseData: { loading: boolean, loaded: boolean, data: IErqDto }) => {
      this.loading = responseData.loading;
      this.erqEntity = responseData.data;

      if (!this.erqEntity || Object.keys(this.erqEntity).length === 0) {
        this.loading = false;
        this.loaded = true;
        return;
      }

      if (!responseData.loading && responseData.loaded) {
        const certification: ICertification = new ERQModel.Certification(this.erqEntity.certification).data;
        const breachNotification: IBreachNotification = new ERQModel.BreachNotification(this.erqEntity.breachNotification).data;
        const ssdlc: ISsdlc = new ERQModel.Ssdlc(this.erqEntity.ssdlc).data;
        const applicationSecurity: IApplicationSecurity = new ERQModel.ApplicationSecurity(this.erqEntity.applicationSecurity).data;
        const deletionRetention: IDeletionRetention = new ERQModel.DeletionRetention(this.erqEntity.deletionRetention).data;
        const privacy: IPrivacy = new ERQModel.Privacy(this.erqEntity.privacy).data;
        const storageSeparation: IStorageSeparation = new ERQModel.StorageSeparation(this.erqEntity.storageSeparation).data;
        const recovery: IRecovery = new ERQModel.Recovery(this.erqEntity.recovery).data;
        const encryption: IEncryption = new ERQModel.Encryption(this.erqEntity.encryption).data;
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
        this.changeProgressBar.emit(this.progressBar);
        this.loaded = responseData.loaded;
        this.ref.detectChanges();
        return;
      }
    });
  }

  private initProgressbar() {
    this.progressBar = {
      [ErqType.Certification]: { completed: 0, compliant: 0 },
      [ErqType.BreachNotification]: { completed: 0, compliant: 0 },
      [ErqType.Ssdlc]: { completed: 0, compliant: 0 },
      [ErqType.ApplicationSecurity]: { completed: 0, compliant: 0 },
      [ErqType.DeletionRetention]: { completed: 0, compliant: 0 },
      [ErqType.Privacy]: { completed: 0, compliant: 0 },
      [ErqType.StorageSeparation]: { completed: 0, compliant: 0 },
      [ErqType.Recovery]: { completed: 0, compliant: 0 },
      [ErqType.Encryption]: { completed: 0, compliant: 0 },
    };
  }
}
