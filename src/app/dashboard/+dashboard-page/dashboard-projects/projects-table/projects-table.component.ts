import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardProject } from 'src/app/dashboard/store/dashboard.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectsTableComponent implements OnInit {

  @Input() projects: DashboardProject[];
  @Input() name: string;
  @Input() inner: boolean;

  @Output() sort = new EventEmitter<Sort>();
  @Output() feedbackLoop = new EventEmitter<string>();

  expandedProject: DashboardProject;

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
  ]

  constructor(private eventEmitter: EventEmitterService, private connectMeService: ConnectMeService) { }

  ngOnInit() {
  }

  pocStatus(project: DashboardProject) {
    this.eventEmitter.onEditPOC({ project: this.name, pocID: project._id, farEndName: 'supplier' });
  }
  riskReport(project: DashboardProject) {
    this.connectMeService.openDetails({ productID: project.productID }, 0);
  }
  justification(project: DashboardProject) {
    this.eventEmitter.onOpenJustification(`${project.product} ${project.supplier}`, project.justification);
  }
}
