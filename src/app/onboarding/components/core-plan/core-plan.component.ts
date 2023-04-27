import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { PlansModalComponent } from './../../../portal/plans-modal/plans-modal.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'core-plan',
  templateUrl: './core-plan.component.html',
  styleUrls: ['./core-plan.component.scss']
})
export class CorePlanComponent implements OnInit {
  @Input() membership: any;

  public fees: string = "";
  public memberPlan: string = "";

  constructor(
    private eventEmitterService: EventEmitterService,
    private modelRef: MatDialog
    ) { }

  ngOnInit(): void {
  }

 contactUs() {
    this.modelRef.open(PlansModalComponent, {
      width: '40vw',
      height: '30vh',
      maxWidth: undefined,
      data: { fees: this.fees ? this.fees : 'perYear', plan: this.memberPlan ? this.memberPlan : 'core' }
    });
  }

  selectFees(fees, plan) {
    this.fees = fees;
    this.memberPlan = plan;
  }

}
