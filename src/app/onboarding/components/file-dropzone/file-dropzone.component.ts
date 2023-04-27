import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { AllowedDocExt } from '@constants/ui.constant';
import { ApiService } from '@services/api/api.service';
import { Socket } from 'ngx-socket-io';

@Component({
  templateUrl: './file-dropzone.component.html',
  selector: 'app-file-dropzone',
  styleUrls: ['./file-dropzone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropzoneComponent extends Destroyable implements OnInit, OnChanges {
  @Input() label: string;
  @Input() placeholder: string;
  @Output() change = new EventEmitter();
  @Input() value: any;
  @Output() save = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() download = new EventEmitter();
  @Input() isSaving = false;
  @Input() isRemoving = false;
  @Input() isError = false;
  @Input() errorText: string;
  @Input() fid: any;
  @Input() uploadStatus: any;
  @Input() accept = AllowedDocExt;
  file: File = undefined;
  files: File[] = [];
  fileHash: string;

  constructor(public router: Router, public apiService: ApiService, private socket: Socket, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.socket.on('file-status', (event) => {
      if (!event.hash) { return; }
      if (event.fid === this.fid) {
        console.log('status' , event);
        this.uploadStatus = event.status;
        this.fileHash = event.hash;
        this.cdRef.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.isSaving;
    if (change && !change.firstChange && change.currentValue === false && change.previousValue === true) {
      this.file = undefined;
    }
  }

  onSelect(event) {
    if (this.isSaving  || this.isRemoving) {
      return;
    }

    // this.errorText = ''
    this.file = event.addedFiles[0];
    // this.change.emit(this.file);
  }

  onRemove(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    if (this.isFile(this.value)) {
      this.change.emit(undefined);
      return;
    }
    this.remove.emit({});
    this.uploadStatus = '';
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

  onSave(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    this.save.emit(this.file);
  }

  downloadFile() {
    if (!this.value) { return; }
    this.download.emit({});
  }
}
