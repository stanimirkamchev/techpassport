import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '@services/api/api.service';
import { IProjectElement } from '@models/IProjectElement';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public questionsAnswers: any = {};
  public projectsList: any;
  public trialFeeNegotiable = false; // !this.apiService.sessionObject.zeroTrialFee;

  constructor(
    private apiService: ApiService
  ) {
    this.trialFeeNegotiable = !this.apiService.sessionObject.zeroTrialFee;
  }


  getProjects(evenEmpty: boolean, all: boolean, bankContextID: string, callback: any) {
    this.apiService.companygetGetProjects(evenEmpty, all, bankContextID).subscribe(
      (data: HttpResponse<any>) => {
        let output = [];
        const body = (data.body as any[]);
        for (const elem of body) {
          const p: IProjectElement = {
            id: elem._id,
            name: elem.name,
            projectID: elem.projectID,
            productID: elem.productID,
            productIsRapid: elem.productIsRapid,
            productName: elem.productName,
            productDescription: elem.productDescription,
            productTaxonomy: elem.productTaxonomy,
            handshakeID: elem.handshakeID,
            pocID: elem.pocID,
            pocStep: elem.pocStep,
            nda: elem.ndaStatus,
            scope: elem.scope,
            waitingForMe: elem.waitingForMe,
            pocConnectionStatus: elem.pocConnectionStatus,
            reviewConnectionStatus: elem.reviewConnectionStatus,
            ndaDisplayStatus: elem.ndaDisplayStatus,
            ndaStatusLastUpdated: elem.ndaStatusLastUpdated,
            pocStatusLastUpdated: elem.pocStatusLastUpdated,
            offConnectionStatus: elem.offConnectionStatus,
            pocStatus: elem.pocStatus,
            supplierName: elem.supplierName,
            farEndName: elem.farEndName,
            farEndID: elem.farEndID,
            trialFee: elem.trialFee,
            pocStartDate: elem.pocStartDate,
            pocCompleteDate: elem.pocCompleteDate,
            isMyBusinessGroup: elem.isMyBusinessGroup,
            businessGroup: elem.businessGroup,
            originatorEmail: elem.originatorEmail,
            originator: elem.originator,
            withWhom: elem.withWhom,
            withWhomInternal: elem.withWhomInternal,
            date: elem.date, // new Date(elem.createdAt),
            messageResponse: elem.messageResponse,
            handshakes: elem.handshakes,
            pocContractStatus: elem.pocContractStatus,
            pocContract: elem.pocContract,
            allow: true
          };
          output.push(p);
        }
        output = output.sort((a: any, b: any) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
        callback(null, output);
      },
      (respError: Error) => {
        callback(respError);
      }
    );
  }

  getPOCs(callback) {
    this.apiService.supplierGetPOCs().subscribe(
      (data: HttpResponse<object>) => {
        const output = [];
        const body = (data.body as any);
        for (const elem of body) {
          const p: IProjectElement = {
            id: elem._id, // << ????
            name: elem.name,
            projectID: elem.projectID,
            productID: elem.productID,
            productName: elem.productName,
            productTaxonomy: elem.productTaxonomy,
            productDescription: elem.productDescription,
            handshakeID: elem.handshakeID,
            pocID: elem.pocID,
            pocStep: elem.pocStep,
            nda: elem.ndaStatus,
            scope: elem.scope,
            waitingForMe: elem.waitingForMe,
            pocConnectionStatus: elem.pocConnectionStatus,
            reviewConnectionStatus: elem.reviewConnectionStatus,
            ndaDisplayStatus: elem.ndaDisplayStatus,
            ndaStatusLastUpdated: elem.ndaStatusLastUpdated,
            pocStatusLastUpdated: elem.pocStatusLastUpdated,
            offConnectionStatus: elem.offConnectionStatus,
            pocStatus: elem.pocStatus,
            supplierName: elem.supplierName,
            farEndName: elem.farEndName,
            farEndID: elem.farEndID,
            originator: elem.originator,
            originatorEmail: elem.originatorEmail,
            withWhom: elem.withWhom,
            withWhomInternal: elem.withWhomInternal,
            date: elem.date, // new Date(elem.createdAt),
            messageResponse: elem.messageResponse,
            isMyBusinessGroup: true,
            trialFee: elem.trialFee,
            pocStartDate: elem.pocStartDate,
            pocCompleteDate: elem.pocCompleteDate,
            pocContractStatus: elem.pocContractStatus,
            pocContract: elem.pocContract
          };
          output.push(p);
        }
        callback(null, output);
      },
      (respError: Error) => {
        callback(respError);
      }
    );
  }

  async createProject(projectName: string, projectID: string, mainContactID: string, noticesAddress: string, callback: any) {
    this.apiService.companyCreateProject(projectName, projectID, mainContactID, noticesAddress).subscribe(
      (data: HttpResponse<any>) => {
        callback(null, (data.body as any)._id);
      },
      (respError: Error) => {
        callback(respError);
        console.log('respError', respError);
      }
    );
  }
  get questionsMap() {
    return {
      supplier: {
        company: {
        },
        details: {
          name: { id: 'S14', sectionID: '2', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Software Name', question: 'What is the product name? (Note: this should be the publicly listed product name).' },
          type: { id: 'S15', sectionID: '2', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Software Type', question: 'Please select the product type or high level functionality' },
          description: { id: 'S16', sectionID: '2', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Product functionality', question: 'Please describe the product functionality' },
          documentation: {
            id: 'S17-bool', sectionID: '2', yesNoFor: ['S17'], challengeFor: ['S'], onPOC: false, riskReport: false,
            negotiable: false, scheduleTitle: 'N/A', question: ''
          },
          documentationDescription: { id: 'S17', sectionID: '2', challengeFor: ['S'], onPOC: true, riskReport: false, negotiable: false, scheduleTitle: 'Documentation/Other Trial Materials', question: 'Please describe the documentation and other trial material provided to the Customer' }
        },
        licensing: {
          softwareLicence: { id: 'S20', sectionID: '3', yesNoFor: ['S21'], challengeFor: ['S'], mustBe: ['S20', 'yes'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Product as a software licence on which the Customer can test on their own systems?', question: 'Do you offer the product as a software licence on which the Customer can test on their own systems?' },
          copiesLimit: { id: 'S21', sectionID: '3', yesNoFor: ['S22'], challengeFor: ['S'], onPOC: true, mustBe: ['S20', 'yes', 'S20', 'yes'], riskReport: true, negotiable: false, scheduleTitle: 'Is there a limit on the number of copies?', negativeAnswer: 'There is no limit on the number of copies the Customer may download and use for the Trial', question: 'Is there a limit on the number of copies of the Software the Customer can download for the Trial?  See Guidance Notes' },
          maxCopiesLimit: { id: 'S22', sectionID: '3', challengeFor: ['S'], mustBe: ['S20', 'yes', 'S20', 'yes'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Number of copies required for POC.', question: 'Please insert the upper threshold of number of copies' },

          anyTerritory: { id: 'S23', sectionID: '3', challengeFor: ['S'], mustBe: ['S23', 'no'], yesNoFor: ['S24'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Can the Customer test the Software in any territory?', question: 'Can the Customer test the Software in any territory?' },
          includedTerritories: { id: 'S24', sectionID: '3', challengeFor: ['S'], qID: '', mustBe: ['S23', 'no'], onPOC: true, riskReport: true, negotiable: false, type: 'countries', scheduleTitle: 'List the included territories', question: 'List the included territories' },
          // "additionalRestrictions": { "id": "S25", "sectionID": "3", "challengeFor": ["S", "B"], "qID": "", "onPOC": true, "riskReport": true, "negotiable": true, "scheduleTitle": "Additional software use / licensing restrictions", "question": "Please insert any additional software use / licensing restrictions" },
          additionalRestrictions: { id: 'S25', sectionID: '3', challengeFor: ['S'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Additional software use / licensing restrictions', question: 'Please insert any additional software use / licensing restrictions' },

          openSource: { id: 'S26', sectionID: '3', challengeFor: ['S'], yesNoFor: ['S27'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Does your solution make use of any open source software?', question: 'Does your solution make use of any open source software?' },
          openSourceList: { id: 'S27', sectionID: '3', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Opensource software', question: 'Please list the opensource software here' },
          thirdParty: { id: 'S28', sectionID: '3', challengeFor: ['S'], yesNoFor: ['S29'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Does your solution depend on any other 3rd party software?', question: 'Does your solution depend on any other 3rd party software?' },
          thirdPartyList: { id: 'S29', sectionID: '3', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: '3rd party software', question: 'PLease list the details here' },
          thirdPartyTester: { id: 'S30', sectionID: '3', challengeFor: ['S'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: '3rd party customer of customer to test this product?', question: 'Do you allow for and 3rd party customer of your customers to test this product?' },
        },
        access: {
          usersLimit: { id: 'S18', sectionID: '4', yesNoFor: ['S19'], challengeFor: ['S'], mustBe: ['S18', 'yes', 'S20', 'no'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Is there a limit on the number of Users', question: 'Is there a limit on the number of Users?' },
          maxUsersLimit: { id: 'S19', sectionID: '4', challengeFor: ['S'], mustBe: ['S18', 'yes', 'S20', 'no'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Number of users required for POC.', info: 'Remove this question If Supplier\'s answer to REF 2.7 is no', question: 'Please insert the upper threshold of number of Users' },

          testEnviroment: { id: 'S31', sectionID: '4', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Supplier to provide hosted testing solution for customer to access.', question: 'Do you offer a hosted solution testing environment which he Customer can access to test your product/solution?' },
          testingPurposes: { id: 'S32', sectionID: '4', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Hosting Environment (SAAS; PAAS; IAAS)', question: 'Please select if SAAS; PAAS; IAAS; IAP; ' },
          testEnviromentDescription: { id: 'S33', mustBe: ['S20', 'no'], sectionID: '4', challengeFor: ['S'], qID: '', onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Hosting Environment (Description)', question: 'If so, please describe the test environment  - see Guidance note [location of cloud servers - TBC if cloud server location should be a separate step if supplier\'s give the Customer the choice of location]' },

          accessTime: { id: 'S34', sectionID: '4', yesNoFor: ['S40-from', 'S40-to'], challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Customer can access the testing environment at any time?', question: 'And can the Customer access the testing environment at any time?' },
          accessTimeFrom: { id: 'S40.1', sectionID: '4', challengeFor: ['S'], ifSo: { S34: 'no' }, onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Access the hosting environment for testing the solution from', question: 'Please set out the  timeframe for which the Customer may access the hosting environment for testing the solution.' },
          accessTimeTo: { id: 'S40.2', sectionID: '4', challengeFor: ['S'], ifSo: { S34: 'no' }, onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Access the hosting environment for testing the solution to', question: 'Please set out the  timeframe for which the Customer may access the hosting environment for testing the solution.' },
          hostedLive: { id: 'S35', sectionID: '4', challengeFor: ['S'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'How will the solution be hosted in live if  successful post POC?', question: 'How will the solution be hosted in live if  successful post POC?' },
          hostedLiveSolution: { id: 'S36', sectionID: '4', challengeFor: ['S'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'And what kind of hosted solution is that?', question: 'And what kind of hosted solution is that?' },
          thirdPartyInfrastructure: { id: 'S37', sectionID: '4', challengeFor: ['S'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'Third party managing your infrastructure', question: 'Do you have a third party managing your infrastructure?' },
          leadTime: { id: 'S41', sectionID: '1', yesNoFor: [], challengeFor: ['S'], onPOC: false, riskReport: true, negotiable: false, onReview: false, scheduleTitle: 'Minimum lead time before commencement date of the Trial', question: 'If you require minimum lead time before commencement date of the Trial? If so, please specify.' },
          additionalServicesDescription: { id: 'S42', sectionID: '4', challengeFor: ['S', 'B'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Additional services you will need to provide to assist the Customer to adequately test the solution', question: 'Please select any additional services you will need to provide to assist the Customer to adequately test the solution' },
          servicesLocations: { id: 'S43', sectionID: '4', challengeFor: ['S'], onPOC: false, riskReport: true, negotiable: false, type: 'coutries', scheduleTitle: 'Locations from which supplier will provide the services', question: 'Please select the locations from which you will provide the services' },
          personalDataPOC: { id: 'S45', sectionID: '6', yesNoFor: [], challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, type: 'boolean', scheduleTitle: 'Personal data as part of the POC?', question: 'Will you be processing any personal data as part of the POC?' },
          personalDataServices: { id: 'S46', sectionID: '6', yesNoFor: [], mustBe: ['S45', 'yes'], challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, type: 'boolean', scheduleTitle: 'Personal data as part of the solution/services provided?', question: 'Will you be processing any personal data as part of the solution/services provided?' },
          personalDataLocations: { id: 'S47', sectionID: '6', yesNoFor: [], mustBe: ['S45', 'yes', 'S45', 'no'], challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, type: 'coutries', scheduleTitle: 'Location(s) from which supplier host the personal data, provide the commodities and/or process the personal data', question: 'Please select the location(s) from which you host the personal data, provide the commodities and/or process the personal data' },
          personalDataTransfer: { id: 'S49', sectionID: '6', yesNoFor: [], mustBe: ['S47', 'yes'], challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Personal data transfer provided to you by the Customer outside of the EEA?', question: 'Will you transfer personal data provided to you by the Customer outside of the EEA?' },

          personalDataTransferMeasures: { id: 'S50', sectionID: '6', yesNoFor: [], challengeFor: ['S', 'B'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Operational and technical measures supplier will take to ensure the personal data is secure and not accessed by unauthorised persons/third parties', question: 'Please list the operational and technical measures you will take to ensure the personal data is secure and not accessed by unauthorised persons third parties' },

          personalDataEmployeesTestingAccess: { id: 'S51', sectionID: '6', yesNoFor: [], mustBe: ['TODO', 'yes'], challengeFor: ['S'], onPOC: true, riskReport: false, negotiable: false, type: 'checkList', answers: { testingAccessToNone: 'None', testingAccessToData: 'Data', testingAccessToSytems: 'Sytems', testingAccessToInfrastructure: 'Infrastructure', testingAccessToPremises: 'Premises' }, scheduleTitle: 'Supplier or any of Supplier\'s employees or contractors require access to Bank data, Systems, infrastructure or premises during testing', question: 'Will you or any of your employees or contractors require access to Bank data, Systems, infrastructure or premises during testing?' },

          personalDataEmployeesLiveAccess: { id: 'S53', sectionID: '6', yesNoFor: [], mustBe: ['TODO', 'yes'], challengeFor: ['S'], onPOC: true, riskReport: false, negotiable: false, type: 'checkList', answers: { liveAccessToNone: 'None', liveAccessToData: 'Data', liveAccessToSytems: 'Sytems', liveAccessToInfrastructure: 'Infrastructure', liveAccessToPremises: 'Premises' }, scheduleTitle: 'Supplier or any of Supplier\'s employees or contractors require access to Bank data, Systems, infrastructure or premises', question: 'Will you or any of your employees or contractors require access to Bank data, Systems, infrastructure or premises?' }
        },
        charges: {
          chargesTrialFee: { id: 'S55', sectionID: '7', yesNoFor: ['S56'], challengeFor: ['S'], onPOC: true, negotiable: false, scheduleTitle: 'Trial Fee', question: '' },
          chargesAmtFee: { id: 'S56', sectionID: '7', challengeFor: ['S', 'B'], mustBe: ['S55', 'yes'], qID: '', onPOC: true, riskReport: true, negotiable: this.trialFeeNegotiable, scheduleTitle: 'Trial Fee', question: '' },
          chargesCaseBasis: { id: 'S57', sectionID: '7', challengeFor: ['S'], onPOC: false, scheduleTitle: 'Trial Fee', question: '' },
        },
        specialConditions: {
          specialConditions: { id: 'S58', sectionID: '8', challengeFor: ['S'], yesNoFor: ['S59'], negotiable: false, onPOC: false, scheduleTitle: 'Special Conditions', question: '' },
          specialConditionsList: { id: 'S59', sectionID: '8', challengeFor: ['S'], qID: '', onPOC: false, riskReport: false, negotiable: false, scheduleTitle: 'Supplier\'s special conditions.', question: '' },
          useCase: { id: 'S60', sectionID: '8', challengeFor: ['S'], yesNoFor: ['S61'], onPOC: false, scheduleTitle: 'Use Case', question: '' },
          useCases: { id: 'S61', sectionID: '8', challengeFor: ['S'], onPOC: true, riskReport: true, negotiable: false, scheduleTitle: 'Supplier\'s use cases.', question: '' }
        }
      },
      buyer: {
        projectRequirementsFormGroup: {
          useCase: { id: 'B02', sectionID: '8', challengeFor: ['B'], onPOC: true, riskReport: false, negotiable: false, scheduleTitle: 'Customer\'s use cases', question: '' },
          assesmentCriteria: { id: 'B3', sectionID: '8', challengeFor: ['B'], onPOC: false, riskReport: false, negotiable: false, scheduleTitle: 'Quality assessment criteria', question: '' },
        },

        additionalConditionsFormGroup: {
          additionalConditions1: { id: 'B05', sectionID: '8', challengeFor: ['B'], onPOC: false, riskReport: false, negotiable: false, scheduleTitle: 'Customer\'s special conditions specific to this trial?', question: '' }
        },
        customerEntityFormGroup: {
          name: { id: 'B06', sectionID: '8', challengeFor: ['B'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'Customer name included in the POC (TBC)', question: '' },
          registredNumber: { id: 'B07', sectionID: '8', challengeFor: ['B'], onPOC: false, riskReport: false, negotiable: false, scheduleTitle: 'Customer Number included in the POC (TBC)', question: '' },
          registredAddress: { id: 'B08', sectionID: '8', challengeFor: ['B'], onPOC: false, riskReport: false, negotiable: false, scheduleTitle: 'Customer Address included in the POC (TBC)', question: '' },
        },
        trailFeeFormGroup: {
          trailFee: { id: 'B-S56', agreeTo: 'S56', ifNot: 'challenge' },
          trailFeeAmt: { id: 'B-S56-C', challengeTo: 'S56', commentField: 'trailFeeComment', ifSo: { 'B-S56': 'challenge' }, autoanswerComment: `${this.apiService.sessionObject.company} do not pay a fee for our proof of concept trials`, negotiable: this.trialFeeNegotiable },
          // "trailFeeComment": { "id": "B-S56-C", "challengeTo": "S56", "ifSo": { "B-S56": "challenge" }, "ignore": true }
        },
        timeTrialFormGroup: {
          startDateTrial: { id: 'B09', sectionID: '1', challengeFor: ['B', 'S'], onPOC: true, riskReport: true, negotiable: true, type: 'date', scheduleTitle: 'Start Date', question: '' },
          endDateTrial: { id: 'B10', sectionID: '1', challengeFor: ['B', 'S'], onPOC: true, riskReport: true, negotiable: true, type: 'date', scheduleTitle: 'End Date', question: '' },
        },
        solutionSuccessfulFormGroup: {
          value: { id: 'B11', sectionID: '8', challengeFor: ['B'], onPOC: false, scheduleTitle: 'Do you expect that this solution will provide or replace any key functionality within the bank?', question: '' },
        },
        specialConditionsFormGroup: {
          // "specialConditions": { "id": "B-S59", "agreeTo": "S59", "ifNot": "challenge" },
          // "sepcialConditionsEdytor": { "id": "B-S59-C", "challengeTo": "S59", "ifSo": { "B-S59": "challenge" } }
        },
        howManyUsersFormGroup: {
          howManyUsers: { id: 'B-S19', challengeTo: 'S19', takeValue: true }
        },
        testSystemFormGroup: {
          testSystem: { id: 'B-S20', agreeTo: 'S21', ifNot: 'cloud system' },
          testingEnv: { id: 'B-S20-C', challengeTo: 'S21', ifSo: { 'B-S20': 'cloud system' } }
        },
        howManyCopiesFormGroup: {
          howManyCopies: { id: 'B-S22', challengeTo: 'S22', takeValue: true }
        },
        acceptHostingFormGroup: {
          acceptHosting: { id: 'B-S33', agreeTo: 'S33', ifNot: 'challenge' },
          enterAcceptHosting: { id: 'B-S33-C', challengeTo: 'S33', ifSo: { 'B-S33': 'challenge' } }
        },
        selectTerritoriesFormGroup: {
          countries: { id: 'B-S24', challengeTo: 'S24' }
        },
        additionaLicenceFormGroup: {
          additionaLicence: { id: 'B-S25', agreeTo: 'S25', ifNot: 'challenge' },
          enterAdditionaLicence: { id: 'B-S25-C', challengeTo: 'S25', ifSo: { 'B-S25': 'challenge' }, takeValue: true }
        },
        providedLocationFormGroup: {
          providedLocation: { id: 'B-S47', agreeTo: 'S47', ifNot: 'challenge' },
          enterLocation: { id: 'B-S47-C', challengeTo: 'S47', ifSo: { 'B-S47': 'challenge' } }
        },
        requireAccessFormGroup: {
          requireAccess: { id: 'B-S51', agreeTo: 'S51', ifNot: 'challenge' },
          enterRequireAccess: { id: 'B-S51-C', challengeTo: 'S51', ifSo: { 'B-S53': 'challenge' } }
        },
        requireAccessLiveFormGroup: {
          accessLive: { id: 'B-S53', agreeTo: 'S53', ifNot: 'challenge' },
          enterAccessLive: { id: 'B-S53-C', challengeTo: 'S53', ifSo: { 'B-S53': 'challenge' } }
        },
        dataTrialFormGroup: {
          dataTrial: { id: 'B-S45', challengeTo: 'S45' },
        },
        outsideEEAFormGroup: {
          outsideEEA: { id: 'B-S49', agreeTo: 'S49', ifNot: 'challenge' },
          enterEEA: { id: 'B-S49-C', challengeTo: 'S49', ifSo: { 'B-S49': 'challenge' } }
        },
        provisionSoftwareFormGroup: {
          provisionSoftware: { id: 'B-S42', agreeTo: 'S42', ifNot: 'challenge' },
          enterSoftware: { id: 'B-S42-C', challengeTo: 'S42', ifSo: { 'B-S42': 'challenge' }, takeValue: true }
        },
        dataClassificationFormGroup: {
          value: { id: 'B12', sectionID: '6', challengeFor: ['B'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'Data classifications which are relevant during live.', question: 'And also for the live service if the product is selected post POC' },
        },
        dataClassificationLiveFormGroup: {
          value: { id: 'B13', sectionID: '6', challengeFor: ['B'], onPOC: false, riskReport: true, negotiable: false, scheduleTitle: 'Data classifications which are relevant during live.', question: 'And also for the live service if the product is selected post POC' },
        },

        technicalOperationFormGroup: {
          technicalOperation: { id: 'B-S50', agreeTo: 'S50', ifNot: 'challenge' },
          technicalOperation1: { id: 'B-S50-C', challengeTo: 'S50', ifSo: { 'B-S50': 'challenge' }, takeValue: true }
        }
      }
    };
  }
}
