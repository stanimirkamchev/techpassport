import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '@services/project/project.service';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { HttpResponse } from '@angular/common/http';

import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { DocuSignComponent } from '@shared/modals/docu-sign-modal/docu-sign.component';
import { IReviewProject } from '@shared/types/IReviewProject';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProjectElement } from '@models/IProjectElement';
import * as moment from 'moment';

// Constants
import { UserType } from '@constants/UserType';
import { FilterOption } from '../static/constants/FilterOption';
import { POCContractStatus, POCStatus } from '../static/constants/POCStatus';
import { ExportColumns } from '../static/constants/ExportColumns';
import { POCScope } from '../static/constants/POCScope';
import { StatusLabel } from '../static/constants/StatusLabel';
import { SortColumn } from '../static/constants/SortColumn';
import { CustomerColumns, DefaultColumns, SupplierColumns } from '../static/constants/DisplayColumnsForConnectionsPage';


@Component({
  selector: 'connections-page',
  templateUrl: './connections-page.component.html',
  styleUrls: ['./connections-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsPageComponent implements OnInit {
  public displayedColumns: string[];
  @Input() userType;
  @Input() filter;
  @Input() bankContextAware;
  @Input() allBusinessGroupsSet; // = false;

  public bankShortlist = [];
  public selectedMenu = 'All';
  public filters = [];
  public dataSource$: Observable<IProjectElement[]>;
  public filteredDataSource$: Observable<IProjectElement[]>;
  public userLevel;
  public pocReportData = [];
  public downloadingPDF;
  public pocReportDataSummary;
  public displayedRRColumns = ['title', 'value'];
  public allBusinessGroups = false;

  constructor(
    private csvExporter: CsvExporterService,
    private eventEmitterService: EventEmitterService,
    private registerDialog: MatDialog,
    private projectService: ProjectService,
    private socket: Socket,
    private apiService: ApiService,
    public connectMeService: ConnectMeService,
    private docuSignDialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userType = this.apiService.sessionObject.type;

    switch (this.userType) {
      case UserType.Customer:
        this.displayedColumns = CustomerColumns;
        break;
      case UserType.Supplier:
        this.displayedColumns = SupplierColumns;
        break;
      default:
        this.displayedColumns = DefaultColumns;
        break;
    }

    if (this.bankContextAware) {
      this.userLevel = 0;
      this.allBusinessGroups = true;
      this.getBanksShortlist();
    } else {
      this.userLevel = this.apiService.sessionObject.level;
      this.allBusinessGroups = this.allBusinessGroupsSet || this.userLevel <= 2;
      this.socket.on('ndaStatus', (_) => {
        this.initData();
      });
      this.socket.on('connectMe', (_) => {
        this.initData();
      });
      this.eventEmitterService.onEditPOCEvent.subscribe((_) => {
        this.initData();
      });
      this.eventEmitterService.onUpdatePOCListEvent.subscribe(() => {
        this.initData();
      });
      this.initData();
    }
  }

  getBanksShortlist() {
    this.apiService.getBanksShortlist().subscribe(
      (dt: any) => {
        this.bankShortlist = dt;
      },
      (_: any) => {
      });
  }

  onBankContextCh(event) {
    this.initData(event.value);
  }

  changeBusinessGroup() {
    this.allBusinessGroups = !this.allBusinessGroups;
    this.initData();
  }

  initData(bankContextID?: string) {
    const thisCallback = (error, projects) => {
      this.projectService.projectsList = [];
      if (!projects) {
        return;
      }
      for (const item of projects) {
        let pocCost = 'n/a';
        if (item.scope === 'POC' && item.trialFee) {
          pocCost = item.trialFee.chargesTrialFee === 'no' ? 'No' : `${item.trialFee.chargesAmtFee} ${item.trialFee?.currency.toUpperCase()}`;
        }

        const reviewProject: IReviewProject = {
          id: item.id,
          handshakeID: item.handshakeID,
          project: item.name,
          productID: item.productID,
          productIsRapid: item.productIsRapid,
          productName: item.productName,
          productDescription: item.productDescription,
          productTaxonomy: item.productTaxonomy,
          pocID: item.pocID,
          pocStep: item.pocStep,
          date: item.date,
          scope: item.scope,
          waitingForMe: item.waitingForMe,
          waitingForMeCheck: !item.waitingForMe,
          ndaStatusLastUpdated: item.ndaStatusLastUpdated,
          pocStatusLastUpdated: item.pocStatusLastUpdated,
          pocConnectionStatus: item.pocConnectionStatus,
          reviewConnectionStatus: item.reviewConnectionStatus,
          offConnectionStatus: item.offConnectionStatus,
          withWhom: item.withWhom,
          withWhomInternal: item.withWhomInternal,
          originator: item.originator,
          originatorEmail: item.originatorEmail,
          businessGroup: item.businessGroup,
          isMyBusinessGroup: item.isMyBusinessGroup,
          pocContractStatus: item.pocContractStatus,
          pocContract: item.pocContract,
          pocCost,
          supplier: '',
          farEndName: item.farEndName, // supplier
          farEndID: item.farEndID,
          nda: this.upperCase(item.nda), // projects[i].ndaStatus,// 'With Supplier',
          ndaDisplayStatus: this.upperCase(item.ndaDisplayStatus), // projects[i].ndaStatus,// 'With Supplier',
          pocStatus: this.upperCase(item.pocStatus),
          pocReview: '',  // << ??
          messageResponse: item.messageResponse,
          connectionHasPOC: item.pocStatus?.length > 0,
          pocStartDate: item.pocStartDate,
          pocCompleteDate: item.pocCompleteDate
        };
        this.projectService.projectsList.push(reviewProject);
      }

      for (const project of this.projectService.projectsList) {
        if (project.scope === POCScope.NDA) {
          const pocProject = this.projectService.projectsList.find(x => x.scope === POCScope.POC && x.productID === project.productID && x.id === project.id);
          if (pocProject) {
            project.connectionHasPOC = true;
          }
        }
      }

      this.dataSource$ = of(this.projectService.projectsList);
      this.applyFilter(FilterOption.All);
    };

    if (this.userType === UserType.Supplier) {
      this.projectService.getPOCs(thisCallback);
    } else {
      this.projectService.getProjects(false, this.allBusinessGroups, bankContextID, thisCallback);
    }
  }

  exportCSV() {
    const exportArray = [];
    let exportColumns;

    const sanitize = (desc: string) => {
      if (desc) {
        desc = desc.replace(/,/g, '‚');
        desc = desc.replace(/"/g, '""');
        desc = desc.replace(/\n\n/g, ' ');
        desc = desc.replace(/\n/g, ' ');
        desc = desc.replace(/\t/g, ' ');
        desc = desc.replace(/\r\n/g, ' ');
      } else {
        desc = '';
      }
      return desc;
    };

    if (this.userType === UserType.Supplier) {
      for (const p of this.projectService.projectsList) {
        exportArray.push({
          Date: p.date,
          Originator: p.originator,
          Product: p.productName,
          Buyer: p.farEndName,
          Scope: p.scope,
          'PoC Start Date': p.pocStartDate ? new Date(p.pocStartDate) : '',
          'PoC Complete Date': p.pocCompleteDate ? new Date(p.pocCompleteDate) : '',
          'PoC cost': p.pocCost,
          Connection: p.ndaDisplayStatus,
          POC: p.pocStatus,
        });
      }
      exportColumns = ExportColumns.SupplierColumns;
    } else {
      for (const p of this.projectService.projectsList) {
        exportArray.push({
          // Date: p.date,
          Originator: sanitize(p.originator),
          Email: p.originatorEmail,
          Project: sanitize(p.project),
          Supplier: sanitize(sanitize(p.farEndName)),
          Product: sanitize(p.productName),
          Taxonomy: sanitize(p.productTaxonomy),
          Description: sanitize(p.productDescription),
          Scope: sanitize(p.scope),
          'PoC Start Date': p.pocStartDate ? moment(new Date(p.pocStartDate)).format('YYYY MMM DD') : '',
          'PoC Complete Date': p.pocCompleteDate ? moment(new Date(p.pocCompleteDate)).format('YYYY MMM DD') : '',
          'PoC cost': sanitize(p.pocCost),
          Connection: sanitize(p.ndaDisplayStatus),
          POC: sanitize(p.pocStatus),
        });
      }
      exportColumns = ExportColumns.DefaultColumns;
    }
    this.csvExporter.export(exportArray, exportColumns, 'TechPassport export', 'YYYY MMM DD');
  }

  signOffPlatform(event, connection) {
    this.apiService.contractSignedOffPlatform(connection.pocID, event.checked).subscribe(
      (_: HttpResponse<object>) => {
      },
      (error: any) => {
        console.error(error);
        connection.applying = false;
      });
  }

  ndaStatusRejectChange(event, connection) {
    connection.applying = true;
    if (this.userType === UserType.Supplier) {
      this.eventEmitterService.onConnectMeResposneBack(connection.handshakeID, !event.checked);
      return;
    }
    this.apiService.connectMeApprove(connection.handshakeID, !event.checked).subscribe(
      (_: HttpResponse<object>) => {
        this.eventEmitterService.onConnectMeResposneBack(connection.handshakeID, !event.checked);
      },
      (error: any) => {
        console.error(error);
        connection.applying = false;
      });
  }

  ndaStatusChange(event, connection) {
    connection.applying = true;
    if (this.userType === UserType.Supplier) {
      this.eventEmitterService.onConnectMeResposneBack(connection.handshakeID, event.checked);
      return;
    }
    this.apiService.connectMeApprove(connection.handshakeID, event.checked).subscribe(
      (_: HttpResponse<object>) => {
        this.eventEmitterService.onConnectMeResposneBack(connection.handshakeID, event.checked);
      },
      (error: any) => {
        console.error(error);
        connection.applying = false;
      });
  }

  upperCase(str) {
    // TODO  - MOVE THAT TO UTILS !!!
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  editPOC(project): void {
    this.eventEmitterService.onEditPOC(project);
  }

  signPOC(project): void {
    if (this.userType === UserType.Customer) {
      return;
    }
    const ref = this.docuSignDialog.open(DocuSignComponent, {
      width: '89vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: project,
    });
    ref.afterClosed().subscribe((_) => {
      this.initData();
    });
  }

  async startPOC(project: IProjectElement) {
    if (project.scope === POCScope.POC) {
      this.connectMeService.startPOC(project);
    } else {
      await this.connectMeService.connectMe(project.id, project.productID, POCScope.POC,
        (data: HttpResponse<object>) => {
          project.handshakeID = (data.body as any)._id; // clone
          this.connectMeService.startPOC(project);
        }, (_: Error) => {
        });
    }
  }

  signNDA(project) {
    this.connectMeService.signNDA(project.handshakeID, (_) => { });
  }

  filterDataset(connections: IProjectElement[], filter: FilterOption) {

    const resultDataset = connections.filter((connection) => {
      const pocStatus = connection?.pocStatus?.toLowerCase();
      const connectionStatus = connection?.ndaDisplayStatus?.toLowerCase();
      const actionStatus = connection?.pocContractStatus?.toLowerCase();
      const scope = connection?.scope?.toLowerCase();

      //region FILTER: COMPLETED
      // const completedCondition1 = (scope === FilterOption.NDA.toLowerCase() && connectionStatus === FilterOption.Completed.toLowerCase());
      const completedCondition2 = (
        connectionStatus === (
          FilterOption.Completed.toLowerCase()
          || pocStatus === FilterOption.Completed.toLowerCase()
          || actionStatus === FilterOption.Completed.toLowerCase())
      ) &&
        pocStatus !== FilterOption.Archived.toLowerCase() &&
        pocStatus !== FilterOption.Draft.toLocaleLowerCase() &&
        actionStatus !== FilterOption.Draft.toLocaleLowerCase();

      //endregion
      //region FILTER: ACTION REQUIRED
      const actionRequired = connectionStatus === FilterOption.AwaitingYourApproval.toLowerCase()
        && pocStatus !== FilterOption.Archived.toLowerCase()
        && pocStatus !== FilterOption.Started.toLowerCase();
      //endregion
      //region FILTER: AWAITING BUYER
      const awaitingBuyer = connectionStatus === FilterOption.AwaitingSuperUser.toLowerCase()
        && pocStatus !== FilterOption.Archived.toLowerCase();
      //endregion

      //region FILTER: AWAITING SUPPLIER
      const awaitingSupplier1 =
        connectionStatus === `Awaiting ${connection.farEndName}'s Approval`.toLowerCase()
        && pocStatus !== FilterOption.Archived.toLowerCase();

      const awaitingSupplier2 =
        (pocStatus === POCStatus.Completed.toLowerCase() || pocStatus === POCStatus.AwaitingSignature.toLowerCase())
        && (actionStatus === POCContractStatus.AwaitingSupplierSignature.toLowerCase() || actionStatus === 'None'.toLowerCase());

      const awaitingSupplier3 = connectionStatus === FilterOption.Completed.toLowerCase() &&
        pocStatus === POCStatus.Draft.toLowerCase() &&
        (actionStatus === 'N/A'.toLowerCase() || actionStatus === 'None'.toLowerCase() || !actionStatus);

      //endregion
      //region FILTER: ARCHIVED
      const archived = pocStatus === POCStatus.Archived.toLowerCase();
      //endregion
      //region FILTER: ALL
      const all = pocStatus !== POCStatus.Archived.toLowerCase();
      //endregion

      const draftCondition1 = connectionStatus === FilterOption.AwaitingYourApproval.toLowerCase() && pocStatus === FilterOption.Started.toLowerCase();
      const draftCondition2 = (
        connectionStatus === FilterOption.AwaitingSuperUser.toLowerCase() || connectionStatus === FilterOption.AwaitingBuyer.toLowerCase()
      )
        && pocStatus === FilterOption.Draft.toLowerCase();

      const draft = (draftCondition1 || draftCondition2) && scope === 'POC'.toLowerCase();
      //endregion

      const completedCondition = completedCondition2;
      const actionRequiredCondition = actionRequired;
      const awaitingBuyerCondition = awaitingBuyer;
      const awaitingSupplierCondition = awaitingSupplier1 || awaitingSupplier2 || awaitingSupplier3;
      const conditions = {
        Completed: completedCondition,
        'Action Required': actionRequiredCondition,
        'Awaiting Buyer': awaitingBuyerCondition,
        'Awaiting Supplier': awaitingSupplierCondition,
        Archived: archived,
        All: all,
        Draft: draft,
      };
      return conditions[filter];
    });
    return resultDataset;
  }

  getPOCReviewStatus(connection) {
    // TODO: it's only used when pocStatus === 'Draft' - so it's not needed ?
    return 'Edit POC';
  }

  getPOCContractStatus(element) {
    switch (element.pocContractStatus) {
      case POCContractStatus.None:
      case POCContractStatus.Pending:
        return this.userType === UserType.Customer
          ? POCContractStatus.AwaitingSupplierSignature
          : POCContractStatus.AwaitingYourSignature;
      case POCContractStatus.Signed:
        return POCContractStatus.SignedBySupplier;
    }
    return '';
  }

  getPOCContractClass(element) {
    if (element.pocContractStatus === POCContractStatus.None || element.pocContractStatus === POCContractStatus.Pending) {
      if (this.userType === UserType.Customer) {
        return 'pending';
      } else {
        return 'action-required';
      }
    }
    return 'success-label';
  }

  getPOCReviewStatusClass(element) {
    const reviewStatus = this.getPOCReviewStatus(element);
    if (element.pocContractStatus === POCContractStatus.Signed) {
      return StatusLabel.Pending;
    }

    if (element.pocStatus === POCStatus.Completed) {
      return StatusLabel.Success;
    }

    if (element.pocStatus === POCStatus.Rejected) {
      return StatusLabel.Rejected;
    }

    if (reviewStatus === FilterOption.ActionRequired) {
      return StatusLabel.ActionRequired;
    }

    if (reviewStatus === FilterOption.AwaitingSuperUser || reviewStatus === FilterOption.AwaitingRequestor) {
      return StatusLabel.Internal;
    }

    return StatusLabel.Pending;
  }

  openJustification(element) {
    this.eventEmitterService.onOpenJustification(`${element.productName} ${element.farEndName}`, element.messageResponse);
  }

  showPOCButton(element) {
    return (element.scope === POCScope.NDA && element.nda === FilterOption.Completed && !element.connectionHasPOC)
      || (element.scope === POCScope.POC && (element.pocStatus === POCStatus.Started || !element.pocStatus));
  }

  applyFilter(filterValue: string) {
    this.selectedMenu = filterValue;
    switch (filterValue) {
      case FilterOption.All:
        this.filteredDataSource$ = this.dataSource$?.pipe(map(data => {
          return data.filter(item => item.pocStatus !== POCStatus.Archived);
        }));
        break;
      case FilterOption.Archived:
        this.filteredDataSource$ = this.dataSource$?.pipe(map((data) => {
          return data.filter((item) => item.pocStatus === POCStatus.Archived);
        }));
        break;
      case 'Awaiting Buyer':
      case 'Awaiting Supplier':
      case 'Action Required':
      case 'Completed':
      case 'Draft':
        this.filteredDataSource$ = this.dataSource$?.pipe(map(data => {
          return this.filterDataset(data, FilterOption[filterValue]);
        }));
        break;
      default:
        // search input functionality
        this.filteredDataSource$ = this.dataSource$?.pipe(map(data => {
          return data.filter((item: any) => {
            return item?.originator?.includes(filterValue)
              || item?.project?.includes(filterValue)
              || item?.productName?.includes(filterValue)
              || item?.farEndName?.includes(filterValue)
              || item?.scope?.includes(filterValue)
              || item?.ndaDisplayStatus?.includes(filterValue)
              || item?.pocStatus?.includes(filterValue);
          });
        }));
        break;
    }
    this.changeDetector.detectChanges();
  }

  onSortChange($event: Sort) {
    const isAsc = $event.direction === 'asc';
    this.filteredDataSource$ = this.filteredDataSource$.pipe(map(data => {
      return data.sort((a, b) => { // sort by date
        switch ($event.active) {
          case SortColumn.Date:
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return this.compare(aDate, bDate, isAsc);
          case SortColumn.Originator:
            return this.compare(a.originator, b.originator, isAsc);
          case SortColumn.Project:
            return this.compare(a.name, b.name, isAsc);
          case SortColumn.ProductName:
            return this.compare(a.productName, b.productName, isAsc);
          case SortColumn.FarEndName:
            return this.compare(a.farEndName, b.farEndName, isAsc);
          case SortColumn.Scope:
            return this.compare(a.scope, b.scope, isAsc);
          // Disabled for now as it does not make sense to sort by cost as it is string
          // case 'pocCost':
          //   return this.compare(a.pocCost, b.pocCost, isAsc);
          case SortColumn.NDADisplayStatus:
            return this.compare(a.ndaDisplayStatus, b.ndaDisplayStatus, isAsc);
          case SortColumn.PocStatus:
            return this.compare(a.pocStatus, b.pocStatus, isAsc);
          default:
            return 0;
        }
      });
    }));
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
