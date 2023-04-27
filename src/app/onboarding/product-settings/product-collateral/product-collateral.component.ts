import { Component, OnInit, ChangeDetectionStrategy, forwardRef, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';


@Component({
  templateUrl: './product-collateral.component.html',
  selector: 'product-collateral',
  styleUrls: ['./product-collateral.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductCollateralComponent),
    multi: true
  }]
})
export class ProductCollateralComponent extends Destroyable implements OnInit, ControlValueAccessor {
  productCollateralForm: FormGroup;
  loading = false;
  onChangeFn: Function;
  onTouched: Function;
  @Input() productId;
  @Input() isOptionalTitle = true;
  @Output() productIdChange = new EventEmitter<any>();

  collateralState = Array(4).fill(0).map(t => ({
    error: '',
    isSaving: false,
    isRemoving: false,
    fid: uuid(),
    uploadStatus: ''
  }));

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.productCollateralForm = this.formBuilder.group({
      file1: new FormControl(''),
      name1: new FormControl(''),
      key1: new FormControl(''),
      file2: new FormControl(''),
      name2: new FormControl(''),
      key2: new FormControl(''),
      file3: new FormControl(''),
      name3: new FormControl(''),
      key3: new FormControl(''),
    });
    this.productCollateralForm.valueChanges.subscribe((value) => this.onChange(value));
  }

  onDownload(index) {
    const pcols = this.productCollateralForm.value;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.apiService.getFileUrl(pcols[`key${index}`]);
    a.download = pcols[`key${index}`] || pcols[`file${index}`];
    a.click();
  }

  onSaveCollateral(file, index) {
    if (this.collateralState[index].isRemoving || this.collateralState[index].isSaving) {
      return;
    }
    this.collateralState[index].isSaving = true;

    const pcols = this.productCollateralForm.value;
    console.log('pcols', pcols);
    this.apiService.saveProductCollateral(this.productId, {
      file,
      collateralName: pcols[`name${index}`],
      index,
      fid: this.collateralState[index].fid
    }).subscribe(res => {
      this.collateralState[index].isSaving = false;
      this.collateralState[index].error = '';
      this.collateralState[index].uploadStatus = '';
      this.productCollateralForm.get(`file${index}`).setValue(res.body.fileName || res.body.fileName);
      this.productCollateralForm.get(`key${index}`).setValue(res.body.file || res.body.fileName);

      if (!this.productId) {
        this.productId = res.body.product;
        this.productIdChange.emit(this.productId);
      }
      this.cdRef.detectChanges();
    }, err => {
      this.collateralState[index].isSaving = false;
      this.collateralState[index].error = err.error.message;
      this.collateralState[index].uploadStatus = '';
      this.cdRef.detectChanges();
    });
  }

  onRemoveCollateral(index) {
    if (this.collateralState[index].isRemoving || this.collateralState[index].isSaving) {
      return;
    }
    this.collateralState[index].isRemoving = true;

    this.apiService.saveProductCollateral(this.productId, {
      file: undefined,
      collateralName: undefined,
      index,
      fid: this.collateralState[index].fid
    }).subscribe(res => {
      this.collateralState[index].isRemoving = false;
      this.collateralState[index].isSaving = false;
      this.collateralState[index].error = '';
      this.collateralState[index].uploadStatus = '';
      this.productCollateralForm.get(`file${index}`).setValue(undefined);
      this.productCollateralForm.get(`key${index}`).setValue(undefined);
      this.productCollateralForm.get(`name${index}`).setValue(undefined);
      this.collateralState[index].uploadStatus = '';
      this.cdRef.detectChanges();
    }, err => {
      this.collateralState[index].isRemoving = false;
      this.collateralState[index].isSaving = false;
      this.collateralState[index].error = err.error.message;
      this.cdRef.detectChanges();
    });
  }

  writeValue(value: any): void {
    this.productCollateralForm.patchValue(value || {});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value);
    }
  }

  onChangeFile($event: any, fileField: string) {
    console.log('$event', $event);
    console.log('fileField', fileField);
    console.log('val name', this.productCollateralForm.get(`name${fileField}`).value);
    console.log('val file', this.productCollateralForm.get(`file${fileField}`).value);


    this.productCollateralForm.get(`file${fileField}`).setValue($event);
    if (!this.productCollateralForm.get(`name${fileField}`).value && this.productCollateralForm.get(`file${fileField}`).value) {
      this.productCollateralForm.get(`name${fileField}`).setValue($event.name);
    }
    this.cdRef.detectChanges();
  }
}
