import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { Socket } from 'ngx-socket-io';
import { transformCsv } from '../../../portal/+outer-market-page/helper/csvFormatter';
import { DisabledUserPortalComponent } from '../../../portal/disabled-user-portal/disabled-user-portal.component';
import { MatDialog } from '@angular/material/dialog';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';

enum FileStatuses {
  blocked = 'blocked',
  allowed = 'allowed',
  processing = 'processing',
}

enum ProcessManager {
  INITIAL = 'initial',
  ERROR = 'error',
  DROP = 'drop_file',
  UPLOAD_SP_START = 'upload_spinner_start',
  UPLOAD_SP_END = 'upload_spinner_end',
  CANCEL = 'cancel',
  IMPORT_SP_START = 'import_spinner_start',
  IMPORT_SP_END = 'import_spinner_end',
}
@Component({
  selector: 'invitation-panel-page',
  templateUrl: './invitation-panel-page.component.html',
  styleUrls: ['./invitation-panel-page.component.scss'],
})

export class InvitationPanelPageComponent implements OnInit, OnDestroy {
  constructor(
    private apiService: ApiService,
    private csvExporter: CsvExporterService,
    private cd: ChangeDetectorRef,
    private socket: Socket,
    private addDialog: MatDialog) {

    this.socket.on('lock-inv-panel', (event) => {
      if (
        event.action === 'remove' &&
        this.apiService.sessionObject.id !== event.userId &&
        this.apiService.sessionObject.onInvitationPage
      ) {
        this.setLock();
      }
    });
    this.socket.on('file-status', (event) => {

      if (!event.hash) { return; }

      if (event.status === FileStatuses.blocked) {
        this.processManager = ProcessManager.ERROR;
      }

      if (this.fileAllowed) { return; }

      if (event.status === FileStatuses.allowed) {
        this.fileAllowed = true;
        this.socket.removeAllListeners('file-status');
      }
    });
  }

  private subscription: Subscription | undefined;
  processEnum = ProcessManager;
  processManager: ProcessManager = ProcessManager.INITIAL;
  fileNameSubscribe$: any;
  buttonFileName = 'No find uploaded file yet';
  fileName = '';
  formData: FormData;
  uploadCounter = 0;
  importCounter = 0;
  openSnackBar = false;
  fileAllowed = false;
  fileNameStatus = true;
  harshFile: File;
  requiredFileType = 'csv';
  fileId = null;
  fileHash = null;
  fileToBinaryArray = null;
  CSVFile = null;
  snackBarOptions = { msg: 'Download complete', color: '#3F9CF4' };
  errorMsg = '';
  isUserLockOut = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.clearLock();
  }

  ngOnInit(): void {
    this.getFileNameFromServer();
    this.setLock();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.fileNameSubscribe$?.unsubscribe();
    this.clearLock();
  }

  onFileDropped($event) {
    const file: File = $event[0].file;
    this.harshFile = file;
    const reader = new FileReader(); // read the selected file
    reader.readAsText(file);

    reader.onload = (onLoadEvent) => {
      const csvData = reader.result;
      this.CSVFile = csvData;
    };
    const ext = file.name.split('.').pop();
    if (ext === this.requiredFileType) {
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append('thumbnail', file);
      this.processManager = ProcessManager.DROP;
    }
  }

  async onFileSelected(e: any) {
    if (e && e.target && e.target.files && e.target.files.length) {
      const file: File = e.target.files[0];
      this.harshFile = file;
      const reader = new FileReader(); // read the selected file
      reader.readAsText(e.target.files[0]);

      reader.onload = (onLoadEvent) => {
        const csvData = reader.result;
        this.CSVFile = csvData;
      };
      const ext = e.target.files[0].name.split('.').pop();
      if (ext === this.requiredFileType) {
        this.fileName = file.name;
        this.formData = new FormData();
        this.formData.append('thumbnail', file);
        this.processManager = ProcessManager.DROP;
      }
    }
    // this.cd.detectChanges();
  }

  downloadCSV(): void {
    const url = this.apiService.getOuterMarketCSVFile(this.buttonFileName);
    if (url === null) { return; }
    const elem = document.createElement('a');
    elem.href = url;
    elem.style.visibility = 'hidden';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
    this.openSnackBar = true;
    this.snackBarOptions.msg = `Download complete`;
    setTimeout(() => {
      this.openSnackBar = false;
    }, 2500);
    // this.cd.detectChanges();
  }

  exportDatabase() {
    const sanitize = (desc: string) => {
      if (desc) {
        desc = desc.replace(/,/g, '\,');
        desc = desc.replace(/"/g, '""');
      } else {
        desc = '';
      }
      return desc;
    };
    this.apiService.getOuterMarketData().subscribe(data => {
      data.map(e => {
        e.url = `"${sanitize(e.url)}"`;
        e.company = `"${sanitize(e.company)}"`;
        e.country = `"${sanitize(e.country)}"`;
        e.description = `"${sanitize(e.description)}"`;
        return e;
      });
      this.csvExporter.export<any>(data, [
        ['Record Status', 'recordStatus'],
        ['Organization ID', 'orgId'],
        ['Companies', 'company'],
        ['URL', 'url'],
        ['Description', 'description'],
        ['taxonomies', 'taxonomy'],
        ['Country', 'country'],
        ['Total Funding (M)', 'totalFunding'],
        ['Latest Funding Round', 'latestFundingRound'],
        ['Latest Funding Date', 'latestFundingDate'],
        ['Latest Funding Amount (M)', 'latestFundingAmount'],
        ['All Investors', (s) => s.investors && s.investors.length > 0 ? `"${sanitize(s.investors.join(', '))}"` : ''],
        ['Latest Valuation (M)', 'latestValuation'],
        ['Acquirer', (s) => s.acquirers && s.acquirers.length > 0 ? `"${sanitize(s.acquirers.join(', '))}"` : ''],
        ['Latest Revenue Min (M)', 'latestRevenueMin'],
        ['Latest Revenue Max (M)', 'latestRevenueMax'],
        ['Revenue Time Period', 'revenueTimePeriod'],
        ['Latest Revenue Multiple Min', 'latestRevenueMultipleMin'],
        ['Latest Revenue Multiple Max', 'latestRevenueMultipleMax'],
        ['Competitors', (s) => s.competitors && s.competitors.length > 0 ? `"${sanitize(s.competitors.join(', '))}"` : ''],
        ['Mosaic (Overall)', 'mosaic'],
        ['DB Status', 'invitationStatus'],
        ['Freezed', 'isFreezed'],
      ], 'outermarketsDB');
    });
  }

  onClickRemoveFile() {
    this.apiService.removeOuterMarketFile('').subscribe(res => {
      if (res.status === 200) {
        this.getFileNameFromServer();
        this.snackBarOptions.msg = `Remove File ${this.buttonFileName}`;
        this.openSnackBar = true;
        setTimeout(() => {
          this.openSnackBar = false;
        }, 1000);
      }
    });
  }

  onClickCancel() {
    this.processManager = ProcessManager.CANCEL;
    this.apiService.removeOuterMarketFile(this.fileId).subscribe(_ => {
      this.getFileNameFromServer();
      this.reset();
    });
  }

  onClickRestart() {
    this.reset();
    this.addFileToTheServer();
  }

  onClickResetProcess() {
    this.reset();
    this.fileName = '';
    this.processManager = ProcessManager.INITIAL;
  }

  closeSnackBar() {
    this.openSnackBar = false;
  }

  onClickImportProcess() {
    this.processManager = ProcessManager.IMPORT_SP_START;
    this.addJsonToServer();
  }

  addFileToTheServer() {
    this.processManager = ProcessManager.UPLOAD_SP_START;
    this.apiService.addOuterMarketCSVFile({ file: this.harshFile, filename: this.fileName }).subscribe(
      (data: HttpResponse<any>) => {
        this.fileId = (data as any)._id;
        this.getFileNameFromServer();
        // this.cd.detectChanges();
      },
      (error: any) => {
        this.processManager = ProcessManager.ERROR;
        this.errorMsg = error.error.name;
      }
    );
    this.uploadFileSimulator();
  }

  // HELPER METHODS //
  private setLock() {
    this.apiService.getUserLockOut().subscribe(
      (data: any) => {
        this.isUserLockOut = data.lockedout;
        if (this.isUserLockOut) {
          this.apiService.sessionObject.onInvitationPage = true;
          const ref = this.addDialog.open(DisabledUserPortalComponent, {
            width: '655px',
            height: 'auto',
            maxWidth: undefined,
            panelClass: 'disabled-user-modal',
            disableClose: false,
            data: { items: null }
          });
        }
      },
      (respError: Error) => {
        this.isUserLockOut = false;
      }
    );
  }

  private clearLock() {
    this.apiService.deleteUserLockOut().subscribe(
      (data: any) => {
        this.isUserLockOut = data.lockedout;
        this.apiService.sessionObject.onInvitationPage = false;
      },
      (respError: Error) => {
        this.isUserLockOut = false;
      }
    );
  }

  private uploadFileSimulator() {
    const progressInterval = setInterval(() => {
      if (this.uploadCounter === 100) {
        this.processManager = ProcessManager.UPLOAD_SP_END;
        clearInterval(progressInterval);
      } else {
        if (this.processManager === ProcessManager.CANCEL) {
          clearInterval(progressInterval);
        }
        this.uploadCounter += 5;
      }
    }, 500);
  }

  private uploadJsonSimulator() {
    const progressInterval = setInterval(() => {
      if (this.importCounter === 100) {
        this.processManager = ProcessManager.IMPORT_SP_END;
        clearInterval(progressInterval);
      } else {
        if (this.processManager === ProcessManager.CANCEL) {
          clearInterval(progressInterval);
        }
        this.importCounter += 5;
      }
    }, 100);
  }

  private reset() {
    this.uploadCounter = 0;
    this.importCounter = 0;
  }

  private addJsonToServer() {
    try {
      const jsonData = transformCsv(this.CSVFile);
      this.apiService.uploadOuterMarketData(jsonData).subscribe(
        (res: any) => {
          // this.cd.detectChanges();
          if (res.success) {
            this.getFileNameFromServer();
          }
        },
        (error: any) => {
          this.processManager = ProcessManager.ERROR;
          this.errorMsg = error.error.name;
        },
      );
      this.uploadJsonSimulator();
    } catch (error) {
      this.errorMsg = error.message;
      this.processManager = ProcessManager.ERROR;
    }

  }

  private getFileNameFromServer() {
    const fileNameSubscribe = this.apiService.getOuterMarketCSVFileName();
    this.fileNameSubscribe$ = fileNameSubscribe.subscribe({
      next: (data) => {
        if (data) {
          this.fileId = data.fileObject._id;
          this.fileHash = data.fileObject.hash;
          this.buttonFileName = data.fileObject.name;
          this.fileNameStatus = false;
          // this.cd.detectChanges();
        } else {
          this.fileNameStatus = true;
        }
      },
      error: (e) => {
        setTimeout(() => {
          this.fileHash = null;
          this.fileNameStatus = true;
          // this.cd.detectChanges();
        }, 1);
      }
    });
  }

}
