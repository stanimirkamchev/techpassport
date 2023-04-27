import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef} from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { Router } from "@angular/router";
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";

@Component({
  selector: 'membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MembershipComponent),
    multi: true
  }]
})
export class MembershipComponent implements OnInit, ControlValueAccessor {
  public memberships: any[] = [];
  public plansLoading: boolean = false;
  public supplierSubscription: any = {};
  onChangeFn: Function
  onTouched: Function

  constructor(
    private apiService: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getMembershipPlans()
    this.getSupplierMembership()
    // this.apiService.supplierDocuAuthSign().subscribe({
    //   next: (data) => {
    //     console.log(data, 'data')
    //     // this.apiService.supplierTermsSign().subscribe({
    //     //   next: (supplierTerms) => {
    //     //     console.log(supplierTerms, "supplierTerms")
    //     //   },
    //     //   error: (error) => {
    //     //     console.log(error, "error")
    //     //   }
    //     // })
    //   },
    //   error: (error) => {
    //     console.log(error, 'error')
    //   }
    // })
    // this.apiService.supplierTermsSign().subscribe({
    //   next: (supplierTerms) => {
    //     console.log(supplierTerms, "supplierTerms")
    //   },
    //   error: (error) => {
    //     console.log(error, "error")
    //   }
    // })
  }

  writeValue(value: any): void {
    // this.companyForm.patchValue(value || {})
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value)
    }
  }

  public getMembershipPlans() {
    this.plansLoading = true;
    this.apiService.getMembershipPlans().subscribe({
      next: ({ body }) => {
        this.memberships = body
        this.plansLoading = false
        this.changeDetectorRefs.detectChanges()
      }
    })
  }

  public getSupplierMembership() {
    this.apiService.supplierSubscription().subscribe({
      next: ({ body }) => {
        this.supplierSubscription = body
        console.log('subscription: ', body)
      }
    })
  }

}
