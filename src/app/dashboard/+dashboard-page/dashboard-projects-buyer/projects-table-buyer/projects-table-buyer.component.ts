import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DashboardProject } from 'src/app/dashboard/store/dashboard.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { ConnectMeService } from '@services/connectme/connectme.service';

@Component({
  selector: 'projects-table-buyer',
  templateUrl: './projects-table-buyer.component.html',
  styleUrls: ['./projects-table-buyer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectsTableBuyerComponent {

  @Input() projects: DashboardProject[];
  @Input() name: string;
  @Input() inner: boolean;

  @Output() sort = new EventEmitter<Sort>();
  @Output() feedbackLoop = new EventEmitter<string>();

  expandedProject: DashboardProject;
  arrow = false;

  displayedColumns = [
    'name',
    'dates',
    'totalSuppliers',
    'totalProducts',
    'duration',
    'scope',
    'pocStatus',
    'connectionStatus',
    'actions'
  ];

  statusClass(element: any) {
    switch (element.pocStatus) {
      case 'Draft':
        return 'blue';
      case 'Action Required':
      case 'Rejected':
      case 'Awaiting Your Approval':
      case 'Declined':
        return 'red';
      case 'Awaiting for Supplier':
        return 'purp';
      case 'Completed':
        return 'green';
      case 'Awaiting Supplier\'s Approval':
      case 'Pending':
      case 'With Supplier':
      case 'No POC':
        return 'orange';
      default:
        return 'black';
    }
  }

  constructor(private eventEmitter: EventEmitterService, private connectMeService: ConnectMeService) { }

  pocStatus(project: DashboardProject) {
    this.eventEmitter.onEditPOC({
      project: this.name,
      pocID: project._id,
      farEndName: 'supplier',
      projStatus: {
        connectionStatus: project.connectionStatus,
        pocStatus: project.pocStatus
      }
    });
  }
  riskReport(project: DashboardProject) {
    this.connectMeService.openDetails({ productID: project.productID }, 0);
  }
  justification(project: DashboardProject) {
    this.eventEmitter.onOpenJustification(`${project.product} ${project.supplier}`, project.justification);
  }
}
