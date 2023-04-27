import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { ProjectService } from '@services/project/project.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

// TODO:OZGUR Move these interfaces to a separate file
export interface ConnectMeModalData {
  action: string;
  supplier: string;
  product: string;
  supplierID: string;
  productID: string;
  productObj: any;
  rapidNDA: boolean;
  rapidPOC: boolean;
  pocConnectionStatus: any;
  reviewConnectionStatus: any;
  nda: any;
}

@Component({
  selector: 'app-connectme-modal',
  templateUrl: './connectme-modal.component.html',
  styleUrls: ['./connectme-modal.component.scss']
})

export class ConnectMeModalComponent implements OnInit {
  public projects = [];
  public team = [];
  public step = 1;
  public inProgress = false;
  public createProjectFormGroup: FormGroup;
  public prevH: string;

  constructor(
    public dialogRef: MatDialogRef<ConnectMeModalComponent>,
    private eventEmitterService: EventEmitterService,
    private projectService: ProjectService,
    private pocDialog: MatDialog,
    private docuSignDialog: MatDialog,
    private apiService: ApiService,
    private connectMeService: ConnectMeService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ConnectMeModalData
  ) {
    this.createProjectFormGroup = fb.group({
      isExising: new FormControl(null, Validators.required),
      linkedProject: new FormControl(null, Validators.required),
      projectTitle: new FormControl(null),
      isRefProjectID: new FormControl(null),
      refProjectID: new FormControl(null),
      mainContact: new FormControl(null),
      mainContatName: new FormControl(null),
      selectMainContact: new FormControl(null),
      cantFindMainContact: new FormControl(null),
      addressNotice: new FormControl(null)
    });
  }

  exit() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.projectService.getProjects(true, false, null, (error, projects) => {
      this.projects = [];
      for (let i = 0; i < projects.length; i++) {
        let j;
        for (j = 0; j < projects[i].handshakes.length; j++) {
          projects[i].handshakes[j].reason = projects[i].handshakes[j].reason === 'review' ? 'compliance' : projects[i].handshakes[j].reason;
          if (projects[i].handshakes[j].product === this.data.productID && projects[i].handshakes[j].reason.toLowerCase() === this.data.action.toLowerCase()) {
            projects[i].allow = false;
            break;
          }
        }
        this.projects.push(projects[i]);
      }
      if (this.projects.length === 0) {
        this.createProjectFormGroup.patchValue({isExising: 'no'});
        this.resizeModal();
      }
    });

    this.apiService.getMyTeam()
      .subscribe(
        (data: HttpResponse<object>) => {
          this.team = data.body as any;
        },
        (respError: Error) => {

        }
      );
  }

  resizeModal(toPrev?: boolean) {
    let h;
    if (toPrev === true) {
      h = this.prevH;
    } else if (this.inProgress === true) {
      h = '190px';
    } else if (this.step === 2) {
      h = '260px';
      this.prevH = h;
    } else {
      if (this.createProjectFormGroup.get('isExising').value === 'yes') {
        h = '325px';
      } else {
        if (this.createProjectFormGroup.get('mainContact').value === 'no') {
          h = '620px';
        } else {
          h = '520px';
        }
      }
      this.prevH = h;
    }


    setTimeout(() => {
      this.dialogRef.updateSize('550px', h);
    }, 80);
  }

  checkValidation() {
    if (this.createProjectFormGroup.get('isExising').value === 'yes'
      && this.createProjectFormGroup.get('linkedProject').value !== null) {
      return false;
    } else {
      if (this.createProjectFormGroup.get('projectTitle').value !== null
        && this.createProjectFormGroup.get('refProjectID').value !== null
        && this.createProjectFormGroup.get('addressNotice').value !== null
      ) {
        if (this.createProjectFormGroup.get('mainContact').value === 'yes') {
          return false;
        }
        if (this.createProjectFormGroup.get('mainContact').value === 'no'
          && this.createProjectFormGroup.get('mainContatName').value !== null) {
          return false;
        }
      }
    }
    return true;
  }

  createProject(reason) {

    if (this.createProjectFormGroup.get('isExising').value === 'yes') {
      if (!this.createProjectFormGroup.get('linkedProject').value) {
        return;
      }
      this.inProgress = true;
      this.resizeModal();
      this[reason](this.createProjectFormGroup.get('linkedProject').value);
      return;
    }

    const projectName = this.createProjectFormGroup.get('projectTitle').value;
    const projectID = this.createProjectFormGroup.get('refProjectID').value;


    const mainContactID = this.createProjectFormGroup.get('mainContact').value === 'no' ? this.createProjectFormGroup.get('mainContatName').value : null;
    const noticesAddress = this.createProjectFormGroup.get('addressNotice').value;
    this.inProgress = true;
    this.resizeModal();
    this.projectService.createProject(
      projectName,
      projectID,
      mainContactID,
      noticesAddress,
      (error, id?) => {
        if (id) {
          this[reason](id);
        } else {
          console.log('handle error', error);
          this.resizeModal(true);
          this.inProgress = false;
        }
      });
  }

  // TODO:OZGUR Make these methods async
  nda(projectID: string) {
    this.connectMeService.connectMe(projectID, this.data.productID, 'nda',
      (_: HttpResponse<object>) => {
        this.inProgress = false;
        this.step = 2;
        this.resizeModal();
      },
      (respError: Error) => {
        this.inProgress = false;
        console.log('respError', respError);
      });
  }

  // TODO:OZGUR Make these methods async
  poc(projectID: string) {
    this.connectMeService.connectMe(projectID, this.data.productID, 'POC',
      (data: HttpResponse<object> | any) => {
        this.inProgress = false;
        this.exit();
        this.eventEmitterService.onChangePage('poc');
        const obj = this.data.productObj;
        obj.handshakeID = data.body._id;
        this.connectMeService.startPOC(this.data.productObj);
      },
      (respError: Error) => {
        this.inProgress = false;
        console.log('respError', respError);
      });
  }

  // TODO:OZGUR Make these methods async
  review(projectID: string) {
    this.connectMeService.connectMe(projectID, this.data.productID, 'review',
      (_: HttpResponse<object> | any) => {
        this.inProgress = false;
        this.step = 2;
        this.resizeModal();
      },
      (respError: Error) => {
        console.log('respError', respError);
      });
  }
}
