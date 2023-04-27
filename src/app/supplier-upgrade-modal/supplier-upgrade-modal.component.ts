import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { Console } from 'console';
import { TimelineLite, Power1 } from 'gsap/all';
import { SupplierMembershipComponent } from '../supplier-membership/supplier-membership.component';
import { SupplierRapidProductsComponent } from '../supplier-rapid-products/supplier-rapid-products.component';

@Component({
  selector: 'supplier-upgrade-modal',
  templateUrl: './supplier-upgrade-modal.component.html',
  styleUrls: ['./supplier-upgrade-modal.component.scss']
})
export class SupplierUpgradeModalComponent implements OnInit {
  @ViewChild(MatStepper) stepper: MatStepper;
  @ViewChild(SupplierMembershipComponent) membershipView: SupplierMembershipComponent;
  @ViewChild(SupplierRapidProductsComponent) rapidView: SupplierRapidProductsComponent;


  private tl = null;
  public requestInProgress = false;
  public viewReady = false;
  private clickwrapIdAgreed;
  private migrationStep = 0;
  constructor(
    private dialogRef: MatDialogRef<SupplierUpgradeModalComponent>,
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.apiService.getSupplierDetails()
      .subscribe((data: HttpResponse<Object>) => {

        this.viewReady = true;
        this.membershipView.currectMembersip((data.body as any).membership);
        this.migrationStep = isNaN((data.body as any).membership.migrationStep) ? 0 : (data.body as any).membership.migrationStep;
        this.requestInProgress = false;

      }, (respError: Error) => {
        this.requestInProgress = false;
        this.viewReady = true;
      })

  }
  ngAfterViewInit() {
    this.tl = new TimelineLite({ repeat: -1 });
    this.tl.to("#arrow_forward", { x: 35, ease: Power1.easeInOut, duration: 0.6 });
    this.tl.to("#arrow_forward", { x: 0, ease: Power1.easeInOut, duration: 0.6 });

  }

  letGoMouseOver() {
    this.tl.pause();
  }

  letGoMouseOut() {
    this.tl.resume();
  }

  fin() {
    //this.apiService.confirmTermsAndCongitionsMigrartion
    this.dialogRef.close();
    this.router.navigateByUrl('/portal');
  }

  letsGo(stepper: MatStepper) {
    this.stepper.selectedIndex = this.migrationStep + 1;
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    switch (stepper.selectedIndex) {
      case 1: {
        const agreement = this.membershipView.getAgreement();

        if (agreement && agreement.clickwrapId) {
          if (this.clickwrapIdAgreed && this.clickwrapIdAgreed === agreement.clickwrapId) {
            this.stepper.next();
          }
          this.requestInProgress = true;
          this.apiService.confirmTermsAndCongitions(agreement.clickwrapId, agreement.clientUserId).subscribe((data: HttpResponse<Object>) => {
            //
            this.clickwrapIdAgreed = agreement.clickwrapId;
            this.apiService.migrationSetepUpdate(1).subscribe((ms: HttpResponse<Object>) => {
              this.stepper.selectedIndex = (ms as any).body.migrationStep + 1;
              this.requestInProgress = false;
            }, (respError: Error) => {
              this.requestInProgress = false;
            })
            //
          }, (respError: Error) => {
            this.requestInProgress = false;
          })
        } else {
          stepper.next();
        }
        break
      }
      case 2: {
        const products = this.rapidView.getProducts();
        this.requestInProgress = true;
        this.apiService.updateProductsRapid(products).subscribe((data: HttpResponse<Object>) => {
          this.apiService.migrationSetepUpdate(2).subscribe((ms: HttpResponse<Object>) => {
            stepper.next();
            this.requestInProgress = false;
          }, (respError: Error) => {
            this.requestInProgress = false;
          })
        }, (respError: Error) => {
          this.requestInProgress = false;
        })
        stepper.next();
        break
      }
    }
  }

  goForwardDisabled() {
    try {
      switch (this.stepper.selectedIndex) {
        case 1:
          return !this.membershipView.isValid();
        case 2:
          return !this.rapidView.isValid();


      }
    } catch (error) {

    }

    return true;
  }







}
