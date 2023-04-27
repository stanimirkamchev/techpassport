import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHandle } from '@directives/dragDrop.directive';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
//import { ModalData } from '../model-data';
export interface UploadModalData {
  type: string;
  productId: string;
  edit: boolean;
  name?: string;
  supplierId?: string
  disableActions?: boolean
}

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})

export class UploadModalComponent implements OnInit {
  public files = [];
  public mediaFormGroup: FormGroup;
  public uploading = false;
  public edit = false;
  public productMedia: any;
  public vidUrl;
  constructor(
    public dialogRef: MatDialogRef<UploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadModalData,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {

    this.mediaFormGroup = fb.group({
      title: new FormControl(''),
      description: new FormControl('')
    })

    this.edit = data.edit;

    if (this.edit === true) {
      this.vidUrl = `/api/v1/product/${this.data.productId}/video/stream`
      this.apiService.getProductVideo(this.data.productId)
        .subscribe(
          (data: HttpResponse<Object>) => {
            this.productMedia = data.body as any;
            this.mediaFormGroup.controls.title.setValue(this.productMedia.title)
            this.mediaFormGroup.controls.description.setValue(this.productMedia.description);
          },
          (respError: Error) => {
            this.edit = false;
            console.log('respError', respError);
          }
        )
    }
  }

  exit(data: any): void {
    this.dialogRef.close(data);
  }
  remove(): void {
    this.apiService.removeProductVideo(this.data.productId)
      .subscribe(
        (data: HttpResponse<Object>) => {
          this.exit(null)
        },
        (respError: Error) => {
          this.edit = false;
          console.log('respError', respError);
        }
      )
  }
  upload(): void {
    let file = this.files[0].file;
    //
    this.uploading = true;
    this.apiService.uploadProductVideo(this.data.productId, file, this.mediaFormGroup.get('title').value, this.mediaFormGroup.get('description').value, this.data.supplierId)
      .subscribe(
        (data: HttpResponse<Object>) => {
          this.uploading = false;
          this.exit(data.body)
        },
        (respError: Error) => {
          this.uploading = false;
          console.log('respError', respError);
        }
      )
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files
  }
  removeFile(i): void {
    let removedFile = this.files.splice(i, 1);
    // TO DO handle removed files which are on the server
  }



  ngOnInit() {

  }

}
