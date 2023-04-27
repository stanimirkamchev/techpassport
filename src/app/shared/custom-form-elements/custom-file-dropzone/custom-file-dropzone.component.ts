import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Destroyable } from '@abstract/destroyable';
import { ApiService } from '@services/api/api.service';
import { Socket } from 'ngx-socket-io';
import { AllowedDocExt } from '@constants/ui.constant';

@Component({
  selector: 'custom-file-dropzone',
  templateUrl: './custom-file-dropzone.component.html',
  styleUrls: ['./custom-file-dropzone.component.scss']
})
export class CustomFileDropzoneComponent extends Destroyable implements OnInit, OnChanges {
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
  @Input() formControlName: string;
  @Input() fid: any;
  @Input() uploadStatus: any;
  @Input() accept = AllowedDocExt;

  file: File = undefined;
  files: File[] = [];
  fileHash: string;

  constructor(public router: Router, public apiService: ApiService, private socket: Socket, private cdRef: ChangeDetectorRef) {
    super();
  }


  ngOnInit(): void {
    // TODO: SOCKET
    this.socket.on('file-status', (event) => {
      if (!event.hash) { return; }
      if (event.fid === this.fid) {
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
    if (this.isSaving || this.isRemoving) {
      return;
    }

    // this.errorText = ''
    this.file = event.addedFiles[0];
    this.change.emit(this.file);
    if (this.isSaving || this.isRemoving) { return; }
    this.save.emit(this.file);
  }

  onRemove(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    if (this.isFile(this.value)) {
      this.file = undefined;
      this.change.emit(undefined);
    }
    this.remove.emit({});
  }

  onRemoveFile(event) {
    event.stopPropagation();
    if (this.isSaving || this.isRemoving) { return; }
    this.file = undefined;
    this.change.emit(undefined);
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
