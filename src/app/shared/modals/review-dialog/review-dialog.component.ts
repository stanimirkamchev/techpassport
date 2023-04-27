import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { ApiService } from '@services/api/api.service';
import { ProjectService } from '@services/project/project.service';
import { Socket } from 'ngx-socket-io';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomCalendarHeader } from '@shared/modals/custom-calendar-header/custom-calendar-header.component';
import { TextConstants } from '@shared/text-constants';

export interface ReviewDialogData {
  projectID: string;
  project: any;
  question?: string;
}

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})

export class ReviewDialogComponent implements OnInit, OnDestroy {
  public minInputDate: Date;
  public maxInputDate: Date;
  public statuses = ['Draft', 'withBuyer', 'withSupplier', 'Declined', 'Completed'];
  public internalStatuses = ['AwaitingResponse', 'AwaitingApproval', 'AwaitingSubmission', 'Pending', 'Approved'];
  public customCalendarHeader = CustomCalendarHeader;
  public approveTooltip = 'Approve';
  public sections = [
    // {
    //   title: 'Trial Materials',
    //   id: 2,
    //   status: 'Action Required',
    //   statusClass: '',
    //   statuses: []
    // },
    {
      title: 'POC Date',
      id: 1,
      status: 'Action Required',
      statusClass: 'actionRequired',
      statuses: []
    },
    // {
    //   title: 'Data',
    //   id: 6,
    //   status: 'Action Required',
    //   statusClass: 'actionRequired',
    //   statuses: []
    // },
    {
      title: 'Trial fees',
      id: 7,
      status: 'Action Required',
      statusClass: 'actionRequired',
      statuses: []
    },
    {
      title: 'Use cases',
      id: 8,
      status: 'Action Required',
      statusClass: 'actionRequired',
      statuses: []
    },
  ];
  public disableYesBtn = false;
  public allComplete = false;
  public loading = true;
  public sideIndex = 0;
  public selectedSection: any;
  public challengeBoxData: any = {};
  public questions: Array<any>;
  public userLevel: number;
  public allowComments: boolean;
  public userPermissions: any;
  public whoAmI: string;
  public whoAmIsymbol: string;
  public myName: string;
  public myCompany: string;
  public showChallengeBox = false;
  public newValue = '';
  public newComment = '';
  public showInternals = true;

  public supplierAccept = {
    rejected: false,
    accepted: true,
    said: '',
    message: '',
    contractReaded: false
  };
  public actionsEnabled = true;
  public alertRef;
  public _statuses = {
    AwaitingResponse: 0,
    AwaitingSubmission: 0,
    AwaitingApproval: 0,
    Completed: 0,
    Approved: 0,
    Declined: 0,
    ActionRequired: 0,
    Total: 0,
    AwaitingFarEnd: 0
  };
  userType = '';

  saveAsDraftButtonText = TextConstants.SaveAsDraft;
  recallPOCToEditButtonText = TextConstants.RecallPOCToEdit;
  archivePOCButtonText = TextConstants.ArchivePOC;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    public apiService: ApiService,
    private projectService: ProjectService,
    private socket: Socket,
    private ref: ChangeDetectorRef,
    private connectMeService: ConnectMeService,
    private alertDialog: MatDialog) {

    this.userLevel = this.apiService.sessionObject.level;
    this.userPermissions = this.apiService.sessionObject.permissions;
    this.whoAmI = this.apiService.sessionObject.type;
    this.myName = this.apiService.sessionObject.displayName;
    this.myCompany = this.apiService.sessionObject.company;
    this.allowComments = this.apiService.sessionObject.allowComments || this.whoAmI === 'supplier'; // get from poc

    if (this.whoAmI === 'customer') {
      this.whoAmIsymbol = 'B';
      if (this.userLevel > 2) {
        this.approveTooltip = 'OK';
      }
    } else {
      this.whoAmIsymbol = 'S';
    }

    if ((data.project.pocConnectionStatus === 'pending' || data.project.pocConnectionStatus === 'declined') && this.whoAmIsymbol === 'S') {
      this.supplierAccept.accepted = false;
      this.actionsEnabled = false;
    } else if (this.whoAmIsymbol === 'B' && data.project.isMyBusinessGroup !== true) {
      this.actionsEnabled = false;
    }
    this.supplierAccept.rejected = data.project.pocConnectionStatus === 'declined';
    this.userType = this.apiService.sessionObject.type;
    console.log('this.userType', this.userType);
  }

  onIOEvent() {
    const _this = this;
    return (event) => {
      if (event.event === 'update') {
        if (event.from === _this.apiService.sessionObject.id) {
          return;
        }
        if (_this.alertRef) {
          return;
        }

        _this.alertRef = _this.alertDialog.open(AlertModalComponent, {
          width: '330px',
          height: '215px',
          disableClose: true,
          data: {
            title: `New data available!`,
            isQuestion: true,
            message: '',
            links: null,
            actions: [{ label: 'Update', color: 'accent' }, { label: 'Skip', color: 'primary' }]
          }
        });
        _this.alertRef.afterClosed().subscribe(result => {
          _this.alertRef = null;
          if (result === 'Update') {
            setTimeout(() => {
              _this.loading = true;
              _this.initData();
            }, 200);

          }
        });

      } else if (event.event === 'new-answer') {

        if (event.from === _this.apiService.sessionObject.id || (_this.userLevel <= 2 && event.answer.internalStatusLevel > 2)) {
          return;
        }

        for (let i = 0; i < this.questions.length; i++) {
          if (_this.questions[i]._id === event.answer.questionID) {
            _this.questions[i].answers.push(event.answer);
            break;
          }
        }
        _this.countStatuses();
      } else if (event.event === 'answer-status') {
        for (let i = 0; i < this.questions.length; i++) {
          if (_this.questions[i]._id === event.answer.questionID) {
            for (let j = 0; j < _this.questions[i].answers.length; j++) {
              if (_this.questions[i].answers[j]._id === event.answer._id) {
                _this.questions[i].answers[j].status = event.answer.status;
                _this.questions[i].answers[j].internalStatus = event.answer.internalStatus;
                _this.questions[i].answers[j].internalStatusLevel = event.answer.internalStatusLevel;
                _this.questions[i].answers[j].isPublic = event.answer.isPublic;
                _this.questions[i].answers[j].approveBy = event.answer.approveBy;
                _this.questions[i].answers[j].approveDate = event.answer.approveDate;
                _this.questions[i].answers[j].approveByType = event.answer.approveByType;
              }
            }
            break;
          }
        }

        setTimeout(() => {
          this.countStatuses();
        }, 200);

      }
    };
  }


  ngOnInit() {
    this.initData();
    this.socket.on('pocStatus', this.onIOEvent());

    this.disableYesBtn = (this.data as any).project.projStatus &&
      (this.data as any).project.projStatus.connectionStatus === 'Completed' &&
      (this.data as any).project.projStatus.pocStatus === 'Completed';
  }

  ngOnDestroy() {
    this.socket.removeAllListeners('pocStatus');
  }

  initData() {
    this.apiService.companyPOCGetAnswers(this.data.project.pocID)
      .subscribe(
        (data: HttpResponse<Object>) => {
          this.questions = [];
          const tmp = data.body as any;
          let i;
          const qMap = this.projectService.questionsMap;
          let answers_c = 0;
          for (let i = 0; i < tmp.length; i++) {
            const proceed = true;
            if (tmp[i].hasOwnProperty('mustBe') && tmp[i].mustBe.length > 1) {
              const pair = {};
              let allow = 0;
              for (let imb = 1; imb < tmp[i].mustBe.length; imb += 2) {
                pair[tmp[i].mustBe[imb - 1]] = tmp[i].mustBe[imb];
              }
              for (let ii = 0; ii < tmp.length; ii++) {
                for (const mbKey in pair) {
                  if (mbKey === tmp[ii].questionScheetID) {
                    for (let iia = 0; iia < tmp[ii].answers.length; iia++) {
                      if (pair[mbKey] === tmp[ii].answers[iia].answer) {
                        allow += 2;
                      }
                    }
                  }
                }
              }
              if (allow !== tmp[i].mustBe.length) {
                continue;
              }
            }
            if (!proceed) {
              continue;
            }

            const q = {
              section: parseInt(tmp[i].sectionID),
              title: tmp[i].scheduleTitle,
              _id: tmp[i]._id,
              questionScheetID: tmp[i].questionScheetID,
              answers: [],
              challengeFor: tmp[i].challengeFor,
              initialAnswer: tmp[i].initialAnswer,
              // internalStatusLevel : tmp[i].internalStatusLevel,
              onPOC: tmp[i].onPOC,
              onReview: tmp[i].onReview,
              onRiskRep: tmp[i].onRiskRep,
              negotiable: tmp[i].negotiable,
              status: tmp[i].status,
              isInitial: tmp[i].isInitial,
              answerType: tmp[i].answerType
            };
            if (q.status === 'Created') {
              continue;
            }
            for (let j = 0; j < tmp[i].answers.length; j++) {
              const a = tmp[i].answers[j];
              answers_c++;
              q.answers.push(a);
            }
            this.questions.push(q);
          }
          this.countStatuses();
          this.changeIndex(0);
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        });
    //
  }

  changeIndex(index: number) {
    this.sideIndex = index;
    this.showChallengeBox = false;
    this.selectedSection = this.sections[index];
  }

  toggleInternal() {
    this.showInternals = !this.showInternals;
  }

  showAnswer(question, answer) {
    return answer.isPublic || this.showInternals === true;
  }

  getQuestionsForSection(sectionID: Number) {
    try {
      return this.questions.filter(q => q.section === sectionID);
    } catch (error) {

    }
  }

  /// ACTIONS
  doUndo(question, answer) {
    const was = answer.internalStatus;
    let newStatus = 'AwaitingResponse';
    let internalStatusLevel = answer.internalStatusLevel;

    if ((this.userLevel <= 2 && answer.internalStatus === 'Approved')
      || (this.userLevel <= 2 && answer.internalStatus === 'AwaitingResponse' && answer.internalStatusLevel <= 2)) {
      newStatus = 'AwaitingApproval';
      internalStatusLevel = 2;
    }
    const oldStatus = answer.internalStatus;
    this.POCAnswerStatus(answer._id, question._id, answer.status, newStatus, internalStatusLevel, (error, dataS) => {
      if (was !== 'Approved') {
        this.doChallenge(question, answer, oldStatus);
      }
    });

  }

  /* doSubmit(question, answer) {
     console.log('question, answer', question, answer);
   }*/
  doCancel() {
    const question = this.challengeBoxData.question;
    const answer = this.challengeBoxData.answer;
    const newStatus = this.challengeBoxData.oldStatus;
    if (!newStatus) {
      this.showChallengeBox = false;
      return;
    }
    this.POCAnswerStatus(answer._id, question._id, answer.status, newStatus, answer.internalStatusLevel, (error, dataS) => {
      this.showChallengeBox = false;
    });
  }

  doSubmitChallange() {
    let internalStatus = null;
    let internalStatusLevel = null;
    let status = null;

    if (this.challengeBoxData.action === 'update') {

      this.challengeBoxData.loading = true;
      let approved = true;

      if (this.challengeBoxData.answer.internalStatus === 'AwaitingApproval') {
        approved = false;
      }

      if (this.challengeBoxData.answer.internalStatus === 'AwaitingApproval' && this.challengeBoxData.answer.internalStatusLevel <= 2) {
        internalStatus = 'AwaitingSubmission';
        internalStatusLevel = 2;
      }
      if (this.challengeBoxData.answer.internalStatus === 'Approved'
        || (this.challengeBoxData.answer.internalStatus === 'Declined' && this.whoAmIsymbol === 'S')) {
        internalStatus = 'Approved';
        internalStatusLevel = this.challengeBoxData.answer.internalStatusLevel;
        status = this.challengeBoxData.answer.status;
        approved = false;

        if (this.challengeBoxData.answer.status === 'Completed' && this.whoAmIsymbol === 'S') {
          status = 'withSupplier';
        } else {
          status = this.challengeBoxData.answer.status;
        }
      }

      let pocAnswerSide = 'POCAnswer';
      if (this.whoAmIsymbol === 'S') {
        pocAnswerSide = 'POCAnswerSupplier';
      }

      let prevQStatus = 'Declined';
      if (this.challengeBoxData.answer.byWhomType !== this.whoAmIsymbol) {
        prevQStatus = 'Completed';
      }

      this.POCAnswerStatus(this.challengeBoxData.answer._id, this.challengeBoxData.question._id, this.challengeBoxData.answer.status, prevQStatus, this.challengeBoxData.answer.internalStatusLevel, (error, dataS) => {
        this[pocAnswerSide](this.challengeBoxData.question._id, this.newValue, this.newComment, approved, status, internalStatus, internalStatusLevel, null, (error, dataA) => {
          if (error) {
            this.challengeBoxData.loading = false;
            return; // handle error
          }

          this.challengeBoxData.loading = false;
          this.showChallengeBox = false;
          for (const q in this.questions) {
            if (this.questions[q]._id === this.challengeBoxData.question._id) {
              this.questions[q].answers.push(dataA);
              break;
            }
          }
          for (const q in this.questions) {
            if (this.questions[q]._id === this.challengeBoxData.question._id) {
              // this.questions[q].answers.push(dataA);
              for (const a in this.questions[q].answers) {
                if (this.questions[q].answers[a]._id === this.challengeBoxData.answer._id) {
                  this.questions[q].answers[a].status = dataS.status;
                  this.questions[q].answers[a].internalStatus = dataS.internalStatus;
                  this.questions[q].answers[a].internalStatusLevel = dataS.internalStatusLevel;
                  break;
                }
              }
              break;
            }
          }

          this.countStatuses();

          if (!this.challengeBoxData.autoanswer && this.challengeBoxData.question.questionScheetID === 'B09') { ///  IT IS START TIME, SET ENDTIME +90 DAYS
            const endDate = this.questions.filter(q => q.questionScheetID === 'B10')[0];
            const answer = endDate.answers[endDate.answers.length - 1];
            this.challengeBoxData = {
              question: endDate,
              answer,
              action: 'update',
              loading: true,
              oldStatus: this.challengeBoxData.oldStatus,
              disableValue: this.challengeBoxData.disableValue,
              autoanswer: true
            }; // conmmentOnly
            const endTime = new Date(this.newValue);
            endTime.setDate(endTime.getDate() + 90);
            this.newValue = endTime as any; // .toISOString()
            this.doSubmitChallange();
          } else if (!this.challengeBoxData.autoanswer && this.challengeBoxData.question.questionScheetID === 'B10') { ///  IT IS ENT TIME, SET START TIME -90 DAYS
            const startDate = this.questions.filter(q => q.questionScheetID === 'B09')[0];
            const answer = startDate.answers[startDate.answers.length - 1];
            this.challengeBoxData = {
              question: startDate,
              answer,
              action: 'update',
              loading: true,
              oldStatus: this.challengeBoxData.oldStatus,
              disableValue: this.challengeBoxData.disableValue,
              autoanswer: true
            }; // conmmentOnly
            const startTime = new Date(this.newValue);
            startTime.setDate(startTime.getDate() - 90);
            this.newValue = startTime as any; // .toISOString();
            this.doSubmitChallange();
          }
        });
      });
    }
  }

  doAgree(question, answer) {
    let newStatus = 'AwaitingSubmission';
    let newInternalStatusLevel = answer.internalStatusLevel;
    const answerStatus = answer.status;
    if (answer.internalStatus === 'AwaitingResponse' && answer.byWhomType !== this.whoAmIsymbol) {
      this.POCAnswer(question._id, answer.answer, 'Agree', true, null, null, null, true, (error, dataA) => {
        if (error) {
          return; // handle error
        }
        for (const q in this.questions) {
          if (this.questions[q]._id === question._id) {
            this.questions[q].answers.push(dataA);
            break;
          }
        }

        this.POCAnswerStatus(answer._id, question._id, answer.status, newStatus, newInternalStatusLevel, (error, dataS) => {
          for (const q in this.questions) {
            if (this.questions[q]._id === question._id) {
              // this.questions[q].answers.push(dataA)
              for (const a in this.questions[q].answers) {
                if (this.questions[q].answers[a]._id === answer._id) {
                  this.questions[q].answers[a].status = dataS.status;
                  this.questions[q].answers[a].internalStatus = dataS.internalStatus;
                  this.questions[q].answers[a].internalStatusLevel = dataS.internalStatusLevel;
                  break;
                }
              }
              break;
            }
          }
          //
        });
      });
      //
      return;
    }

    if (newStatus === 'AwaitingSubmission' && answer.internalStatusLevel <= 2 && answer.responseFromFarEnd === true) {
      newStatus = 'Approved';
    } else if (answer.internalStatus === 'AwaitingResponse' && answer.internalStatusLevel <= 2) {
      newStatus = 'Approved';
      newInternalStatusLevel = 4; // ???
    } else if (answer.internalStatus === 'AwaitingResponse' && (answer.internalStatusLevel > 2 && answer.agreedByID !== this.apiService.sessionObject.id)) {
      newStatus = 'Approved';
      newInternalStatusLevel = 2; // ???
    } else if (answer.internalStatus === 'AwaitingApproval' && this.userLevel <= 2) {
      /* if (answer.isInitial && answer.isPublic) {
         answerStatus = newStatus = 'Completed';
       } else {
         newStatus = 'Approved';
       }*/
      newStatus = 'Approved';
      newInternalStatusLevel = 4; // ???
    }

    this.POCAnswerStatus(answer._id, question._id, answerStatus, newStatus, newInternalStatusLevel, (error, dataS) => {
      // ok
      for (const q in this.questions) {
        if (this.questions[q]._id === question._id) {
          for (const a in this.questions[q].answers) {
            if (this.questions[q].answers[a]._id === answer._id) {
              this.questions[q].answers[a].status = dataS.status;
              this.questions[q].answers[a].internalStatus = dataS.internalStatus;
              this.questions[q].answers[a].internalStatusLevel = dataS.internalStatusLevel;
              this.questions[q].status = dataS.qStatus;
              break;
            }
          }
          break;
        }
      }
      //
    });
    // SEND NEW answer
    // VALUE = answer.value;
    // COMMENT = "AGREE"
    // CHANGE INTERNAL STATUS = AwaitingSubmission
  }

  doChallenge(question, answer, oldStatus?: string) {
    if (
      answer.internalStatus === this.internalStatuses[1]
      || answer.internalStatus === this.internalStatuses[0]
      || answer.internalStatus === this.internalStatuses[4]) {
      const action = 'update';
      const loading = false;

      const disableValue = answer.internalStatus === this.internalStatuses[4] && answer.isPublic !== true;
      // let conmmentOnly = answer.internalStatus === 'AwaitingApproval' && answer.internalStatusLevel <= 2;
      this.challengeBoxData = { question, answer, action, loading, oldStatus, disableValue }; // conmmentOnly
      this.newValue = answer.answer;
      this.newComment = ''; // answer.comment;
      if (disableValue === true) {
        this.newComment = answer.comment;
      }
      this.showChallengeBox = true;
    }
  }

  doAgreeSupplier(question, answer) {

    this.POCAnswerSupplier(question._id, answer.answer, 'Completed', false, 'Completed', 'Approved', null, null, (error, dataA) => { // 'Approved'
      if (error) {
        return; // handle error
      }
      for (const q in this.questions) {
        if (this.questions[q]._id === question._id) {
          this.questions[q].answers.push(dataA);
          break;
        }
      }
    });
  }

  doChallengeSupplier(question, answer, oldStatus?: string) {
    const action = 'update';
    const loading = false;
    const disableValue = false;
    this.challengeBoxData = { question, answer, action, loading, oldStatus, disableValue };
    this.newValue = answer.answer;
    this.newComment = '';
    this.showChallengeBox = true;
  }

  doUndoSupplier(question, answer) {
    this.doChallengeSupplier(question, answer, answer.internalStatus);
  }

  /// ACTIONS END
  /// STATUSES SHOW
  // internalStatuses =  [ 'AwaitingResponse', 'AwaitingApproval', 'AwaitingSubmission', 'Pending' ];
  showQuestionMenuSupplier(question, answer, indexQuestion) {
    if (this.whoAmIsymbol === 'B') {
      return false;
    }

    if (this.data.project.pocStatus === 'Completed') {
      return false;
    }

    return !this.showChallengeBox
      // && (answer.status !== 'Completed' && answer.isPublic === true)
      && ((
        question.answers.length - 1 === indexQuestion
        || (question.answers.length === 1 && (answer.status === 'withSupplier' || answer.status === 'Draft' || (answer.status === 'Completed' && answer.internalStatus === 'Approved'))))
        && question.challengeFor.indexOf(this.whoAmIsymbol) > -1);
  }

  showQuestionMenu(question, answer, indexQuestion) {

    if (this.whoAmIsymbol === 'S') {
      return false;
    }

    if (this.data.project.pocStatus === 'Completed') {
      return false;
    }

    return !this.showChallengeBox
      // && answer.status !== 'withSupplier'
      && (answer.isPublic !== true
        || answer.isInitial === true
        || (answer.isPublic === true && answer.internalStatus === 'AwaitingResponse' && this.userLevel - answer.internalStatusLevel <= 1))
      // || (answer.isPublic === true && answer.internalStatus === 'AwaitingResponse' && this.userLevel > 2))
      && (
        (question.answers.length - 1 === indexQuestion
          || (question.answers.length === 1 && answer.internalStatus === this.internalStatuses[0]))
        && question.challengeFor.indexOf(this.whoAmIsymbol) > -1);
  }

  showAgree(question, answer) {
    // answer.internalStatusLevel
    return ((answer.internalStatus === this.internalStatuses[0] && this.userLevel > 2)
      || (answer.internalStatus === this.internalStatuses[1] && this.userLevel <= 2)); // && answer.internalStatusLevel >= this.userLevel;
  }

  showChallenge(question, answer) {
    return question.negotiable
      && ((answer.internalStatus === this.internalStatuses[0] && this.userLevel > 2)
        || (answer.internalStatus === this.internalStatuses[1] && this.userLevel <= 2));
    // && answer.internalStatusLevel >= this.userLevel;
  }

  showEdit(question, answer) {
    // answer.internalStatusLevel
    return this.whoAmIsymbol === 'B' && answer.isPublic !== true && answer.internalStatus === 'Approved' && this.userLevel > 2; // AND STILL INTERNALL!!
  }

  showUndo(question, answer) {
    return this.data.project.pocStatus !== 'Completed'
      && question.negotiable && answer.internalStatus
      === this.internalStatuses[2] && answer.internalStatusLevel >= this.userLevel;
  }

  showProcurmentUndo(question, answer) {
    return this.data.project.pocStatus
      !== 'Completed' && question.negotiable
      && this.whoAmIsymbol === 'B'
      && ((this.userLevel <= 2 && answer.status !== 'withSupplier'
        && (answer.internalStatus === 'Approved'
          || (answer.internalStatus === 'AwaitingResponse'
            && answer.internalStatusLevel <= 2))) ||
        (answer.isPublic === true && question.status === 'Completed'
          && answer.status === 'Completed' && answer.internalStatus === 'Completed'
          && question.challengeFor.indexOf(this.whoAmIsymbol) > -1));
  }

  showAgreeSupplier(question, answer) {
    // answer.internalStatusLevel
    return answer.status === 'withSupplier' && answer.isPublic === true && answer.byWhomType === 'B';
  }

  showChallengeSupplier(question, answer) {
    return question.negotiable && answer.status === 'withSupplier' && answer.isPublic === true && answer.byWhomType === 'B';
  }

  showUndoSupplier(question, answer) {
    return this.data.project.pocStatus !== 'Completed' && question.negotiable && answer.isPublic !== true && answer.internalStatus === 'Approved'; // answer.internalStatus === 'Approved' && (answer.status === 'withSupplier' || answer.status === 'Draft') && answer.byWhomType === this.whoAmIsymbol;
  }

  challengeBoxButtonsDisable() {
    this.challengeBoxData.loading === true || this.newValue?.length === 0 || this.newComment?.length === 0;
  }

  submitDisabled() {
    if (this.userLevel > 2) {
      return this._statuses.ActionRequired > 0 || this._statuses.AwaitingSubmission === 0;
    }
    return false;
  }

  submitFarEndEnabled() {
    const a = this._statuses.AwaitingResponse + this._statuses.AwaitingSubmission
      + this._statuses.AwaitingApproval
      + this._statuses.Declined + this._statuses.ActionRequired + this._statuses.AwaitingFarEnd;
    return a === 0 && (this.userLevel <= 2 || this.whoAmI === 'supplier');
  }

  countStatusesSupplier() {
    const c = 0;

    this._statuses = {
      AwaitingSubmission: 0,
      AwaitingResponse: 0,
      AwaitingApproval: 0,
      Completed: 0,
      Approved: 0,
      Declined: 0,
      ActionRequired: 0,
      Total: 0,
      AwaitingFarEnd: 0
    };

    for (let i = 0; i < this.questions.length; i++) {
      this._statuses.Total = this._statuses.Total + 1;
      for (let j = this.questions[i].answers.length - 1; j >= 0; j--) {

        if (this.questions[i].answers[j].internalStatus === 'Approved' && this.questions[i].answers[j].isPublic !== true) {
          this._statuses.Approved = this._statuses.Approved + 1;
          break;
        }

        if (this.questions[i].answers[j].internalStatus === 'Approved' && this.questions[i].answers[j].isPublic === true && this.questions[i].status === 'withSupplier') {
          this._statuses.ActionRequired = this._statuses.ActionRequired + 1;
          break;
        }

        if (this.questions[i].status === 'withBuyer') {
          this._statuses.AwaitingApproval = this._statuses.AwaitingApproval + 1;
          break;
        }
        if (this.questions[i].status === 'Completed') {
          this._statuses.Completed = this._statuses.Completed + 1;
          break;
        }

        if (this.questions[i].status === 'withSupplier') { /// CHECK A STATUS
          this._statuses.ActionRequired = this._statuses.ActionRequired + 1;
          break;
        }

        break;
      }
    }
    for (let i = 0; i < this.sections.length; i++) {
      this.getSectionClass(this.sections[i]);
    }
    this.ref.detectChanges();
    return c;
  }

  countStatuses() {

    if (this.whoAmIsymbol === 'S') {
      this.countStatusesSupplier();
      return;
    }
    const c = 0;

    // /this.statuses[]
    this._statuses = {
      AwaitingSubmission: 0,
      AwaitingApproval: 0,
      AwaitingResponse: 0,
      Completed: 0,
      Approved: 0,
      Declined: 0,
      ActionRequired: 0,
      Total: 0,
      AwaitingFarEnd: 0
    };

    for (let i = 0; i < this.questions.length; i++) {
      this._statuses.Total = this._statuses.Total + 1;
      if (this.questions[i].status === 'withSupplier') {
        this._statuses.AwaitingFarEnd = this._statuses.AwaitingFarEnd + 1;
        continue;
      }


      for (let j = this.questions[i].answers.length - 1; j >= 0; j--) {

        if (this.questions[i].answers[j].status === 'Completed') {
          this._statuses.Completed = this._statuses.Completed + 1;
          break;
        }

        if (this.questions[i].answers[j].internalStatus === 'Approved' && this.questions[i].answers[j].isPublic !== true) {
          this._statuses.Approved = this._statuses.Approved + 1;
          break;
        }


        if (this.questions[i].answers[j].internalStatus === 'AwaitingSubmission') {
          if (this.userLevel > 2 && this.questions[i].answers[j].internalStatusLevel > 2) {
            this._statuses.AwaitingSubmission = this._statuses.AwaitingSubmission + 1;
          } else if (this.userLevel <= 2 && this.questions[i].answers[j].internalStatusLevel <= 2) {
            this._statuses.AwaitingSubmission = this._statuses.AwaitingSubmission + 1;
          }

          break;
        }

        if (this.questions[i].answers[j].internalStatus === 'AwaitingApproval' && this.questions[i].answers[j].internalStatusLevel < this.userLevel) { // or <= ?
          this._statuses.AwaitingApproval = this._statuses.AwaitingApproval + 1;
          break;
        }

        if (this.questions[i].answers[j].internalStatus === 'Declined' && this.userLevel <= 2) { /// HERE ???
          this._statuses.AwaitingApproval = this._statuses.AwaitingApproval + 1;
          break;
        }


        if (this.questions[i].answers[j].internalStatus === 'AwaitingResponse' && this.userLevel > 2) { // or <= ?
          this._statuses.ActionRequired = this._statuses.ActionRequired + 1;
          break;
        }

        if (this.questions[i].answers[j].internalStatus === 'AwaitingResponse' && this.questions[i].answers[j].internalStatusLevel <= this.userLevel) {
          this._statuses.ActionRequired = this._statuses.ActionRequired + 1;
          break;
        } else if (this.questions[i].answers[j].internalStatus === 'AwaitingResponse') {
          this._statuses.AwaitingResponse = this._statuses.AwaitingResponse + 1;
          break;
        }
        if (this.questions[i].answers[j].internalStatus === 'AwaitingApproval') { /// test  && this.questions[i].answers[j].internalStatusLevel === this.userLevel
          this._statuses.ActionRequired = this._statuses.ActionRequired + 1;
          break;
        }
        break;
      }
    }
    for (let i = 0; i < this.sections.length; i++) {
      this.getSectionClass(this.sections[i]);
    }

    this.ref.detectChanges();
    this.allComplete = this._statuses.Total === this._statuses.Completed;
    return c;
  }

  getSectionClassSupplier(section) {
    const _q = this.questions.filter(q => q.section === section.id);
    const t = '';
    section.statusDescription = '';
    section.statusClass = null;
    for (let i = 0; i < _q.length; i++) {
      if (_q[i].status === 'withBuyer') {
        section.statusClass = 'awaiting-fe-approval';
        section.statusDescription = 'With Buyer';
        return section.statusClass;
      }

      if (_q[i].status === 'Completed') {
        section.statusClass = 'completed';
        section.statusDescription = 'Completed';
      }


      const j = _q[i].answers.length - 1;
      if (j < 0) {
        continue;
      }

      if (_q[i].answers[j].internalStatus === 'Approved' && _q[i].answers[j].isPublic === true) {
        section.statusDescription = 'Action Required';
        section.statusClass = 'actionRequired';
        return section.statusClass;
      }

      if (_q[i].answers[j].internalStatus === 'Approved' && _q[i].answers[j].isPublic !== true) {
        section.statusClass = 'approved';
        section.statusDescription = `Awaiting Submission to ${this.data.project.farEndName}`;
      }
    }

    // section.statusDescription = 'Action Required';
    // section.statusClass = 'actionRequired';
    return section.statusClass;
  }

  getSectionClass(section) {
    if (this.whoAmIsymbol === 'S') {
      this.getSectionClassSupplier(section);
      return;
    }
    const _q = this.questions.filter(q => q.section === section.id);
    let t = '';
    section.statusClass = null;
    for (let i = 0; i < _q.length; i++) {

      if (this.userLevel <= 2 && _q[i].answers.length === 0 && _q[i].status !== 'Completed') {
        section.statusClass = 'awaiting-approval';
        section.statusDescription = 'With Buisness Team';
        return section.statusClass;
      }

      if (_q[i].status === 'withSupplier') {
        section.statusClass = 'awaiting-fe-approval';
        section.statusDescription = 'With Supplier';
        return section.statusClass;
      }
    }
    if (this.userLevel > 2) {
      for (let i = 0; i < _q.length; i++) {
        if (_q[i].answers.length === 0) {
          continue;
        }
        for (let j = _q[i].answers.length - 1; j < _q[i].answers.length; j++) {
          if (_q[i].answers[j].internalStatus === 'AwaitingResponse') {
            section.statusClass = 'actionRequired';
            section.statusDescription = 'Action Required';
            return section.statusClass;
          }
        }

        for (let j = _q[i].answers.length - 1; j < _q[i].answers.length; j++) {
          if (_q[i].answers[j].internalStatus === 'AwaitingSubmission' && this.userLevel > 2) {
            section.statusDescription = 'Awaiting Submission';
            section.statusClass = 'awaiting-submission';
            return section.statusClass;
          }
        }

        for (let j = _q[i].answers.length - 1; j < _q[i].answers.length; j++) {
          if (_q[i].answers[j].internalStatus === 'AwaitingApproval' && this.userLevel > 2) {
            section.statusDescription = 'Awaiting Internal Approval';
            section.statusClass = 'awaiting-approval';
            return section.statusClass;
          }
        }
      }
    }
    for (let i = 0; i < _q.length; i++) {
      const j = _q[i].answers.length - 1;
      if (j < 0) {
        continue;
      }

      if (_q[i].answers[j].internalStatusLevel > this.userLevel && _q[i].answers[j].internalStatus === 'AwaitingResponse') {
        section.statusClass = 'awaiting-approval';
        section.statusDescription = 'With Buisness Team';
        return section.statusClass;
      } else if (_q[i].answers[j].internalStatus === 'AwaitingResponse' && this.userLevel > 2) { ///  /// TEST THIS IN BUISS
        section.statusClass = 'actionRequired';
        section.statusDescription = 'Action Required';
        return section.statusClass;
      } else if (_q[i].answers[j].internalStatus === 'Approved') { /// TEST THIS IN BUISS
        if (this.userLevel > 2) {
          section.statusClass = 'approved';
          section.statusDescription = `Awaiting Submission to ${this.data.project.farEndName}`;
          return section.statusClass;
        }
        section.statusClass = 'approved';
        section.statusDescription = 'Approved';
        // return section.statusClass;
      } else if (_q[i].answers[j].internalStatus === 'AwaitingApproval') { // _q[i].answers[j].internalStatus  === 'AwaitingResponse' ||
        if (_q[i].answers[j].internalStatusLevel < this.userLevel) {// &&  _q[i].answers[j].internalStatus  === 'AwaitingApproval'
          section.statusClass = 'awaiting-approval';
          section.statusDescription = 'Awaiting Approval';
          return section.statusClass;
        }/*else  if (_q[i].answers[j].internalStatusLevel > this.userLevel){ /// TEST THIS IN BUISS /// &&  _q[i].answers[j].internalStatus  === 'AwaitingApproval'
                    section.statusClass = 'approved';
                    section.statusDescription = 'Approved';
                    return section.statusClass;
                }*/
        else {
          console.log('if e 2 ', section.title, _q[i].answers[j]);
          section.statusClass = 'actionRequired';
          section.statusDescription = 'Action Required';
          return section.statusClass;
        }
      } else {

        if (_q[i].answers[j].status === 'Completed') {
          if (t.length === 0) {
            t = _q[i].answers[j].status;
          }
        } else {
          t = _q[i].answers[j].internalStatus;
        }
      }
      //  }
    }
    if (section.statusClass) {
      return section.statusClass;
    }

    if (t === 'AwaitingSubmission') {
      t = 'Awaiting Submission';
      section.statusClass = 'awaiting-submission';
    } else if (t === 'Completed') {
      section.statusClass = 'completed';
    } else if (t === 'Approved') {
      section.statusClass = 'approved';
    } else {
      section.statusClass = '';
    }
    section.statusDescription = t;
    return section.statusClass;
  }

  getQuestionStatusSupplier(question) {

    if (question.status === 'Completed') {
      question.statusCalss = 'completed';
      return question.status;
    }

    if (question.status === 'withBuyer') {
      question.statusCalss = 'awaiting-fe-approval';
      return 'With Buyer';
    }


    // for (let i = 0; i < question.answers.length; i++){
    const i = question.answers.length - 1;
    if (i >= 0) {
      if (question.answers[i].internalStatus === 'Approved') { //
        if (question.answers[i].isPublic === true) {
          question.statusCalss = 'actionRequired';
          return 'Action Required';
        }
        question.statusCalss = 'approved';
        return `Awaiting Submission to ${this.data.project.farEndName}`;
      }
      if (question.answers[i].internalStatus === 'Declined') {
        question.statusCalss = 'declined';
        return `Declined`;
      }
    }

    question.statusCalss = 'awaiting-fe-approval';
    return 'With Buyer';
  }

  getQuestionStatus(question) {

    if (this.whoAmIsymbol === 'S') {
      return this.getQuestionStatusSupplier(question);
    }
    if (question.status === 'Completed') {
      // question.statusCalssAR = false;
      question.statusCalss = 'completed';
      return question.status;
    }

    if (this.whoAmIsymbol === 'B' && question.status === 'withSupplier') {
      // question.statusCalssAR = false;
      question.statusCalss = 'awaiting-fe-approval';
      return 'With Supplier';
    }
    const i = question.answers.length - 1;
    if (i >= 0) {
      if (question.answers[i].internalStatus.indexOf('Awaiting') === 0) {

        if (question.answers[i].internalStatusLevel < this.userLevel && question.answers[i].internalStatus === 'AwaitingResponse') {
          // question.statusCalssAR = false;
          question.statusCalss = 'actionRequired';
          return 'Action Required';
        }


        if (question.answers[i].internalStatusLevel < this.userLevel) {
          // question.statusCalssAR = false;
          question.statusCalss = 'awaiting-approval';
          return 'Awaiting Internal Approval'; // internal
        }


        if (question.answers[i].internalStatus > 2 && question.answers[i].internalStatus === 'AwaitingApproval') {
          // question.statusCalssAR = false;
          question.statusCalss = 'awaiting-approval';
          return 'With Requestor Team'; // internal
        }


        if (question.answers[i].internalStatus === 'AwaitingSubmission' && question.answers[i].internalStatusLevel >= this.userLevel) { //
          // question.statusCalssAR = false;
          question.statusCalss = 'awaiting-submission';
          return 'Awaiting Interal Submission';
        }

        if (question.answers[i].internalStatus === 'AwaitingResponse' && this.userLevel <= 2) { // question.answers[i].internalStatusLevel >= this.userLevel
          // question.statusCalssAR = false;
          question.statusCalss = 'awaiting-approval';
          return 'With Requestor Team';
        }

        question.statusCalss = 'actionRequired';
        return 'Action Required';
      } else if (question.answers[i].internalStatus === 'Approved') { //
        // question.statusCalssAR = false;
        if (this.userLevel <= 2) {
          question.statusCalss = 'approved';
          return 'Approved';
        } else {
          question.statusCalss = 'approved';
          return `Awaiting Submission to ${this.data.project.farEndName}`;
        }
      }
    }

    let s = question.status;

    if (s === 'withBuyer') {
      s = 'With Requestor Team';
      question.statusCalss = 'awaiting-approval';
    } else if (s === 'withSupplier') {
      s = 'With Supplier';
      question.statusCalss = 'awaiting-fe-approval';
    }

    // question.statusCalssAR = false;
    // question.statusCalss = 'completed';
    // question.statusCalss  = 'awaiting-approval';
    return s;
  }


  approveAll() {
    let records = 'record';
    if (this._statuses.ActionRequired > 1) {
      records += 's';
    }
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '330px',
      height: '270px',
      disableClose: true,
      data: {
        title: `Are you sure you want to approve ${this._statuses.ActionRequired} ${records}?`,
        isQuestion: false,
        message: '',
        links: null,
        actions: [{ label: 'Yes', color: 'primary' }, { label: 'No', color: 'primary' }]
      }
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result === 'Yes') {
        this.loading = true;
        this.apiService.companyPOCApproveAll(this.data.project.pocID).subscribe((data: HttpResponse<Object>) => {
          this.initData();
        });
      }
    });
  }

  submitAll() {
    let records = 'record';
    if (this._statuses.AwaitingSubmission > 1) {
      records += 's';
    }
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '330px',
      height: '270px',
      disableClose: true,
      data: {
        title: `Are you sure you want to send ${this._statuses.AwaitingSubmission} ${records} for internal review?`,
        message: '',
        links: null,
        actions: [{ label: 'Yes', color: 'primary' }, { label: 'No', color: 'primary' }]
      }
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result === 'Yes') {
        this.loading = true;
        this.apiService.companyPOCSubmitAll(this.data.project.pocID).subscribe((data: HttpResponse<Object>) => {
          this.initData();
        });
      }
    });


  }

  submitAllToFarEnd() {
    const fromObj = 'Approved';
    let records = 'record';
    if (this._statuses[fromObj] > 1) {
      records += 's';
    }
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '330px',
      height: '270px',
      disableClose: true,
      data: {
        title: `Are you sure you want to send ${this._statuses[fromObj]} ${records} to ${this.data.project.farEndName}?`,
        message: '',
        links: null,
        actions: [{ label: 'Yes', color: 'primary' }, { label: 'No', color: 'primary' }]
      }
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result === 'Yes') {
        this.loading = true;
        this.apiService.companyPOCSubmitFeAll(this.data.project.pocID, this.data.project.handshakeID).subscribe((data: HttpResponse<Object>) => {
          this.initData();
        });
      }
    });
  }

  //// ApiService
  async POCAnswerStatus(answerID: string, questionID: string, status: string, internalStatus: string, internalStatusLevel: number, callback: Function) {
    this.apiService.companyPOCAnswerStatus(answerID, questionID, status, internalStatus, internalStatusLevel).subscribe((data: HttpResponse<Object>) => {
      try {
        callback(null, data.body);
        // this.countStatuses();
        // stepObj.dbObj[(data.body as any).questionID]['answer'] = data.body;
      } catch (error) {
        console.log(error);
        callback(error);
      }
      this.challengeBoxData.loading = false;
    });
    this.challengeBoxData.loading = true;
  }

  async POCAnswer(
    questionID: string, answer: any, comment: string, approved: boolean,
    status?: string, internalStatus?: string, internalStatusLevel?: number,
    fromFarEnd?: boolean, callback?: Function) {
    // (pocID: string, questionScheetID: string, questionID: string,  answer: any, date?: string, onBehalf?: string, comment?: string, challengeTo?: boolean ){)

    this.apiService.companyPOCAnswer(null, null, questionID, answer, null, null, comment, null, approved, null, status, internalStatus, internalStatusLevel, fromFarEnd).subscribe((data: HttpResponse<Object>) => {
      try {
        if (callback) {
          callback(null, data.body);
        }
        //  this.countStatuses();
        // stepObj.dbObj[(data.body as any).questionID]['answer'] = data.body;
      } catch (error) {
        console.log(error);

        callback(error);
      }
      this.challengeBoxData.loading = false;
    });
    this.challengeBoxData.loading = true;
  }

  async POCAnswerSupplier(questionID: string, answer: any, comment: string, approved: boolean, status?: string, internalStatus?: string, internalStatusLevel?: number, fe?: string, callback?: Function) {
    // (pocID: string, questionScheetID: string, questionID: string,  answer: any, date?: string, onBehalf?: string, comment?: string, challengeTo?: boolean ){)
    this.apiService.supplierPOCAnswer(null, null, questionID, answer, null, null, comment, null, approved, null, status, internalStatus, internalStatusLevel).subscribe((data: HttpResponse<Object>) => {
      try {
        callback(null, data.body);
        this.countStatuses();
        // stepObj.dbObj[(data.body as any).questionID]['answer'] = data.body;
      } catch (error) {
        console.log(error);
        callback(error);
      }
    });
  }

  supplierConnectionResp(answer: string) {
    /// ACCEPT WITH NDA pk4
    if (answer === 'reject' || answer === 'proceed') {
      /// CONNECT ME ANSWER
      this.connectMeService.connectMeRespond(this.data.project.handshakeID, answer === 'proceed', this.supplierAccept.message,
        (data: HttpResponse<Object>) => {

        },
        (respError: Error) => {

        });

      if (answer === 'reject') {
        this.data.project.pocConnectionStatus = 'declined';
        this.exit();
      } else {
        this.data.project.pocConnectionStatus = 'completed';
        this.supplierAccept.accepted = true;
        this.actionsEnabled = true;
      }

    } else {
      this.supplierAccept.said = answer;
    }
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>, qID: string) {
    console.log('event', event);
    this.setMinMaxDate(qID);
    /*if (qID === 'B09') {
      let endDate = this.questions.filter(q => q.questionScheetID === 'B10');
      console.log('>endDate', endDate);
      /// CHANGE IT  - SET NEW ANSWER
    } else {
      let startDate = this.questions.filter(q => q.questionScheetID === 'B09');
      console.log('>startDate', startDate);
      /// CHANGE IT - SET NEW ANSWER
    }*/
    /// WHEN CONFIRM ???
    // B09: Start Date
    // B10: End Date

  }

  monthChange(event) {
    console.log('monthChange', event);
    this.newValue = event;
  }

  setMinMaxDate(qID: string) {
    const startDate = this.questions.find(q => q.questionScheetID === 'B09').answers.slice(-1)[0].answer;
    // let endDate = this.questions.find(q => q.questionScheetID === 'B10')['answers'].slice(-1)[0]['answer'];
    if (qID === 'B09') {
      this.minInputDate = new Date();
      this.maxInputDate = null;
    } else {
      this.minInputDate = startDate;
      this.maxInputDate = null;
    }

  }

  openQuestion($event, question) {
    if (question.questionScheetID === 'B09' || question.questionScheetID === 'B10') {
      this.setMinMaxDate(question.questionScheetID);
    }
  }

  completePOC() {
    this.loading = true;
    this.apiService.companySavePOC(this.data.project.pocID, 'Completed', 0).subscribe((data: HttpResponse<Object>) => {
      this.loading = true;
      this.dialogRef.close();
    }, (err: any) => {
      this.loading = true;
      this.dialogRef.close();
    });
  }

  downloadAsPDF(contractType: string) {
    return this.apiService.getBuyerContractTemplateURL(this.data.project.pocID, contractType);
  }

  submitToFarEndButtonEnabled(): boolean {
    return this.submitFarEndEnabled() && this._statuses?.Approved > 0 && this.actionsEnabled;
  }

  nowIs() {
    return new Date();
  }

  exit() {
    this.dialogRef.close();
  }

  onArchive() {
    this.apiService.setArchiveProject(
      this.data.project.pocID,
      this.data.project.handshakeID,
      this.data.project.productID,
      this.data.project.id,
    ).subscribe(data => {
      this.dialogRef.close();
    });
  }

  onDraft() {
    this.apiService.setDraftProject(
      this.data.project.pocID,
      this.data.project.handshakeID,
      this.data.project.productID,
      this.data.project.id,
    ).subscribe(data => {
      this.dialogRef.close();
    });
  }

  onRecall() {
    this.apiService.recallProject(
      this.data.project.pocID,
      this.data.project.handshakeID,
      this.data.project.productID,
      this.data.project.id,
    ).subscribe(data => {
      this.dialogRef.close();
    });
  }

}
