import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EventEmitterService } from "@services/event-emitter/event-emitter.service";
import { MatTabsModule, MatTabGroup } from "@angular/material/tabs";
import { ApiService } from "@services/api/api.service";
import { HttpResponse } from "@angular/common/http";
import { AssessmentService } from "@services/assesment/assessment.service"; //AssessmentComponentData
import { getName } from "country-list";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { forkJoin, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export interface ComplianceModalData {
  complianceShow: boolean;
  insuranceShow: boolean;
  detailsShow: boolean;
  companyShow: boolean;
  product: any;
  insurance: any;
}

@Component({
  selector: "app-compliance-modal",
  templateUrl: "./compliance-modal.component.html",
  styleUrls: ["./compliance-modal.component.scss"],
})
export class ComplianceModalComponent implements OnInit {
  @ViewChild("horiziontalTabs", { static: true }) horiziontalTabs: MatTabGroup;

  getName = getName;
  getUnicodeFlagIcon = getUnicodeFlagIcon;

  selectedAssesment: any;
  assessmentList$: Observable<any>;
  informationSecurity$: Observable<any>;
  productReview$: Observable<any>;

  public assesmentList: any = [];
  public product: any = {
    supplier: {
      about: "",
    },
    product: {},
    details: {
      specialConditions: {},
    },
  };
  constructor(
    public dialogRef: MatDialogRef<ComplianceModalComponent>,
    public apiService: ApiService,
    private assessmentService: AssessmentService,
    @Inject(MAT_DIALOG_DATA) public data: ComplianceModalData
  ) { }

  ngOnInit() {
    this.productReview$ = this.apiService.adminGetProductReview(this.data.product.productID);
    this.assessmentList$ = this.apiService
      .adminGetComplianceChecklist(this.data.product.supplierID)
      .pipe(tap((list) => (this.selectedAssesment = list[0])));
    this.informationSecurity$ = this.apiService.adminGetComplianceInformationSecurity(
      this.data.product.supplierID
    );

    if (this.data.complianceShow === true) {
      this.horiziontalTabs.selectedIndex = 2;
    } else if (this.data.detailsShow === true) {
      this.horiziontalTabs.selectedIndex = 1;
    } else if (this.data.insuranceShow === true) {
      this.horiziontalTabs.selectedIndex = 3;
    } else if (this.data.companyShow === true) {
      this.horiziontalTabs.selectedIndex = 0;
    }

    this.apiService
      .companyPOCProductDetails(this.data.product.productID)
      .subscribe(
        (data: HttpResponse<Object>) => {
          let body = data.body as any;
          this.product = body;
        },
        (respError: Error) => {
          console.log("respError", respError);
        }
      );
  }

  exit() {
    this.dialogRef.close();
  }

  getInsuranceVal(certType) {
    return this.data.product.insurance?.find(x => x.certType === certType)?.value;
  }
  getInsuranceDate(certType) {
    return this.data.product.insurance?.find(x => x.certType === certType)?.validDate;
  }

  getVidUrl(prod) {
    return `/api/v1/product/${prod.id}/video/frame`
  }

}
