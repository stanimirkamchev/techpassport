import { Component, OnInit, OnChanges, Output, EventEmitter, forwardRef, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { AllowedMovExt } from '@constants/ui.constant';
import { FormTracker } from '../../form-tracker';
import { Socket } from 'ngx-socket-io';

@Component({
  templateUrl: './product-video.component.html',
  selector: 'product-video',
  styleUrls: ['./product-video.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductVideoComponent),
    multi: true
  }],
})
export class ProductVideoComponent extends Destroyable implements OnInit, OnChanges, ControlValueAccessor {
  productVideoForm: FormGroup;
  onChangeFn: Function;
  onTouched: Function;
  @Output() save = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Input() isSaving = false;
  @Input() isTitle = true;
  @Input() isRemoving = false;
  @Input() isError = false;
  @Input() errorText: string;
  @Input() formName: string;
  @Input() submitted = false;
  @Input() vidUrl;
  @Input() uploadStatus;
  @Input() fid;

  file: File;
  fileStatus;
  hash;
  AllowedMovExt = AllowedMovExt;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tracker: FormTracker,
    private socket: Socket,
    private cdRef: ChangeDetectorRef,

  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.isSaving;
    if (change && !change.firstChange && change.currentValue === false && change.previousValue === true) {
      this.file = undefined;
    }
  }

  ngOnInit() {
    this.socket.on('file-status', (event) => {
      if (!event.hash) { return; }
      if (event.fid === this.fid) {
        this.uploadStatus = event.status;
        this.hash = event.hash;
        this.cdRef.detectChanges();
      }
    });

    this.productVideoForm = this.formBuilder.group({
      videoName: new FormControl(''),
      videoDescription: new FormControl(''),
      file: new FormControl(undefined),
    });
    this.tracker.tracking(this.formName, 'ProductVideoComponent', this.productVideoForm.valid);
    this.productVideoForm.valueChanges.subscribe((value) => this.onChange(value));
    this.productVideoForm.get('file').valueChanges.subscribe((value) => {
      if (value) {
        this.productVideoForm.get('videoName').setValidators(Validators.required);
        this.productVideoForm.get('videoName').updateValueAndValidity();
        this.productVideoForm.get('videoDescription').setValidators(Validators.required);
        this.productVideoForm.get('videoDescription').updateValueAndValidity();
      } else {
        this.productVideoForm.get('videoName').clearValidators();
        this.productVideoForm.get('videoName').updateValueAndValidity();
        this.productVideoForm.get('videoDescription').clearValidators();
        this.productVideoForm.get('videoDescription').updateValueAndValidity();
      }
      this.productVideoForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ProductVideoComponent', this.productVideoForm.valid);
    });
  }

  get value() {
    return this.productVideoForm.get('file').value;
  }

  onSelect(event) {
    if (this.isRemoving || this.isSaving) { return; }
    // this.errorText = ''
    this.file = event.addedFiles[0];
    this.save.emit(this.file);
  }

  onRemove(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    this.remove.emit({});
  }

  onRemoveFile(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    this.file = undefined;
    // this.errorText = ''
  }

  isFile(value) {
    return value && (typeof value !== 'string');
  }

  writeValue(value: any): void {
    this.productVideoForm.patchValue(value || {});
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
      this.tracker.tracking(this.formName, 'ProductVideoComponent', this.productVideoForm.valid);
    }
  }
}
