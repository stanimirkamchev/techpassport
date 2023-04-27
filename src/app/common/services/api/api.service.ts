import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, delay } from 'rxjs/operators';
import {
  Types
} from '../../../admin/+admin-page/+edit-tables-page/partials/simple-table/simple-table.component';
import {
  Supplier,
  SupplierReview,
} from 'src/app/admin/store/supplier/supplier.model';
import {
  Table,
} from 'src/app/admin/store/editTables/editTables.model';
import {
  Product,
  ReviewBoolean,
  ProductReview,
} from 'src/app/admin/store/product/product.model';
import {
  Compliance,
  ComplianceItems,
} from 'src/app/admin/store/compliance/compliance.model';
import {
  AccessManagement,
  AccessManagementStatus,
  AccessManagementUserRole,
  AccessManagementUserType,
  AccessLog,
  ErrorHandling,
  UserDTO,
  ErrorHandlingType,
} from 'src/app/admin/store/superuser/superuser.model';
import {
  BuyerEntity,
  BuyerInvoices,
  BuyerGroup,
  BuyerSanctions,
  BuyerSaml,
  BuyerDummy,
  Buyer,
  BuyerForm,
  BuyerInvite,
  BuyerContractTemplate,
} from 'src/app/onboarding/store/buyer/buyer.model';
import { Customer } from 'src/app/admin/store/customer/customer.model';
import {
  DashboardAlerts,
  DashboardResources,
  DashboardFilters,
  DashboardKPIs,
  DashboardSecurityTrends,
  DashboardProject,
  MarketPreview,
  SearchesPreview,
  TechnologyPreview,
  TrendsPreview,
} from 'src/app/dashboard/store/dashboard.model';
import { isUndefined, pickBy } from 'lodash';
import { FeedbackSchema, FeedbackModel } from '../../../feedback/feedback.model';
import { OuterMarketTableModel } from '../../../portal/+outer-market-page/outerMarket.models';
import { AnyCnameRecord } from 'dns';
import { InvitationStatus, InviteSuppliersTableModel } from 'src/app/invite-suppliers-module/invite-suppliers.model';

export interface SessionElement {
  id: string;
  hasSession: boolean;
  details: string;
  displayName: string;
  company?: string;
  expiresInSeconds: number;
  role: string;
  rapid: boolean;
  auth0user?: any;
  allowComments: boolean;
  allowUseCases: boolean;
  zeroTrialFee: boolean;
  requireNDA: boolean;
  level: number;
  status: string;
  type: string;
  membership: string;
  domain?: string;
  permissions: Array<any>;
  onInvitationPage?: boolean | null;
  groupName?: string | null;
}


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private BASE_URL = '';
  private API_PREFIX = '/api/v1';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', responseType: 'text' }),
    withCredentials: false,
    observe: 'response' as 'response',
  };

  private httpOptionsMultipart = {
    withCredentials: false,
    observe: 'response' as 'response',
    timeout: 260000,
  };

  public sessionObject: SessionElement = {
    id: null,
    hasSession: false,
    details: null,
    displayName: null,
    company: null,
    expiresInSeconds: 0,
    level: 0,
    role: '',
    rapid: false,
    allowComments: true,
    allowUseCases: true,
    requireNDA: true,
    auth0user: null,
    status: null,
    type: '',
    membership: 'none',
    domain: '',
    permissions: [],
    zeroTrialFee: false,
    groupName: ''
  };

  constructor(
    private httpClient: HttpClient,
    private platformLocation: PlatformLocation,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.BASE_URL = (platformLocation as any).location.origin + this.API_PREFIX;
  }
  ping(auth0user: any | null = null): Observable<any> {
    return this.getRecaptchaToken('ping').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/ping`,
          { auth0user, token },
          this.httpOptions
        )
      )
    );
  }
  checkInvToken(inviteToken: string): Observable<any> {
    return this.getRecaptchaToken('user/join/check').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/join/check`,
          { token, inviteToken },
          this.httpOptions
        )
      )
    );
  }
  userProfile(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/user/profile`,
      this.httpOptions
    );
  }

  updateUserPassword(password: string): Observable<any> {
    return this.getRecaptchaToken('updateUserPassword').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/password`,
          { password, token },
          this.httpOptions
        )
      )
    );
  }

  updateUserProfile(user: any): Observable<any> {
    return this.getRecaptchaToken('profile').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/profile`,
          { ...user, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  registerSSO(user: any): Observable<any> {
    return this.getRecaptchaToken('sso').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/register/sso`,
          { ...user, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  registerThroughInvite(user: any): Observable<any> {
    console.log('registerThroughInvite', user);
    return this.getRecaptchaToken('inviteregister').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/inviteregister`,
          { ...user, ...{ token } },
          this.httpOptions,
        )
      )
    );
  }

  register(user: any): Observable<any> {
    return this.getRecaptchaToken('register').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/register`,
          { ...user, ...{ token } },
          this.httpOptions,
        )
      )
    );
  }

  register2fa(code: any): Observable<any> {
    return this.getRecaptchaToken('2fa').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/register/2fa`,
          { code, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  register2faResend(): Observable<any> {
    return this.getRecaptchaToken('resend').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/register/2fa/resend`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  login(user: any): Observable<any> {
    return this.getRecaptchaToken('login').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/login`,
          { ...user, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  loginSSO(user: any): Observable<any> {
    return this.getRecaptchaToken('login/sso').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/login/sso`,
          { ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.getRecaptchaToken('resetpassword').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/resetpassword`,
          { email, token },
          this.httpOptions
        )
      )
    );
  }

  setNewPassword(password: string): Observable<any> {
    return this.getRecaptchaToken('setpassword').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/setpassword`,
          { password, token },
          this.httpOptions
        )
      )
    );
  }

  login2fa(code: any): Observable<any> {
    return this.getRecaptchaToken('login/2fa').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/login/2fa`,
          { ...code, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  login2faResend(reset: boolean): Observable<any> {
    return this.getRecaptchaToken('resend').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/login/2fa/resend`,
          { reset, token },
          this.httpOptions
        )
      )
    );
  }

  reset2fa(code: any): Observable<any> {
    return this.getRecaptchaToken('resetpassword/2fa').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/user/resetpassword/2fa`,
          { ...code, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  destroySession(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/session/logout`,
      this.httpOptions
    );
  }

  renewSession(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/session/renew`,
      this.httpOptions
    );
  }

  contact(data: any): Observable<any> {
    return this.getRecaptchaToken('contact').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/contact`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  getSupplierDetails(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/details`,
      this.httpOptions
    );
  }
  addSupplierMember(data): Observable<any> {
    return this.httpClient.post(
      `${this.BASE_URL}/supplier/members`,
      data,
      this.httpOptions
    );
  }

  removeSupplierMember(id: number): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/supplier/members`,
      this.httpOptions
    );
  }

  getSupplierActicity(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/activity`,
      this.httpOptions
    );
  }

  // START OUTER MARKET DATA API


  getUserLockOut(): Observable<any> {
    return this.getRecaptchaToken(`outermarket/lockout`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/lockout`,
            { ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  deleteUserLockOut(): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/outermarket/lockout`,
      this.httpOptions
    );
  }

  getOuterMarketData(): Observable<any> {
    return this.httpClient
      .get<OuterMarketTableModel[]>(`${this.BASE_URL}/outermarket/records`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  getOuterMarketSearchesPreview(): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/omsearchesreview/record`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  inviteSuppliers(ids: number[]): Observable<any> {
    return this.getRecaptchaToken(`outermarket/invite`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/invite`,
            { ids, ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  getOuterMarketCSVFile(fileName: string) {
    return `${this.BASE_URL}/outermarket/download?name=${fileName}`;
  }

  getOuterMarketCSVFileName(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/outermarket/filename`, {
        ...this.httpOptions,
        reportProgress: true,
      })
      .pipe(map((res) => res.body));
  }

  addOuterMarketCSVFile(payload: any): Observable<any> {
    return this.getRecaptchaToken(`outermarket/file`)
      .pipe(
        switchMap((token) => {
          const formData: FormData = new FormData();
          formData.append('file', payload.file);
          formData.append('filename', payload.filename);
          formData.append('token', token);
          return this.httpClient.post(
            `${this.BASE_URL}/outermarket/file`,
            formData,
            this.httpOptionsMultipart
          );
        })
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  onBoardSupplier(id: number[]): Observable<any> {
    return this.getRecaptchaToken(`outermarket/onBoard`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/onBoard`,
            { id, ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  cancelInvitedSuppliers(ids: number[]): Observable<any> {
    return this.getRecaptchaToken(`outermarket/cancelInvited`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/cancelInvited`,
            { ids, ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  uploadOuterMarketCSVFile(file: File): Observable<any> {
    return this.getRecaptchaToken(`outermarket/upload`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/upload`,
            { file, ...{ token }, reportProgress: true },
            this.httpOptions,
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  uploadOuterMarketData(data: any[]): Observable<any> {
    return this.getRecaptchaToken(`outermarket/upload`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/outermarket/upload`,
            { data, ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  omSearchPreview(all: string | null, company: string | null): Observable<any> {
    return this.getRecaptchaToken(`omsearchesreview/record`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/omsearchesreview/record`,
            { all, company, ...{ token } },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  removeOuterMarketFile(fileName: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/outermarket/file?name=${fileName}`,
      this.httpOptions
    );
  }

  //  ЕND OF OUTER MARKET API

  getSupplierTaxonomyTags(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/taxonomy`,
      this.httpOptions
    );
  }

  getSupplierStamps(productID?: string): Observable<any> {
    productID = productID ? `?productID=${productID}` : '';
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/stamps${productID}`,
      this.httpOptions
    );
  }

  supplierDetails(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/details').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/details`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  supplierMembership(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/membership').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/membership`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  supplierSubscription(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/subscription`,
      this.httpOptions
    );
  }

  supplierMembershipPayment(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/membership/payment').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/membership/payment`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  supplierBranding(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/branding').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/branding`,
          { ...data, ...{ token } },
          this.httpOptionsMultipart
        )
      )
    );
  }

  supplierBrandingLogo(logo: File): Observable<any> {
    return this.getRecaptchaToken('branding/logo').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        if (logo) { formData.append('logo', logo); }
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/supplier/branding/logo`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  getSupplierBrandingLogo(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/companyLogo`,
      this.httpOptionsMultipart
    );
  }

  downloadFile(key: string) {
    return this.httpClient.get(`${this.BASE_URL}/file/${key}`, this.httpOptionsMultipart
    );
  }

  getFileUrl(key: string) {
    return `${this.BASE_URL}/file/${key}`;
  }

  supplierTermsSign(): Observable<any> {
    return this.getRecaptchaToken('terms/sign').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/terms/sign`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  getSupplierTermsStatus(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/terms/status`,
      this.httpOptions
    );
  }

  supplierPayment(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/payment').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/payment`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  supplierInsurance(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/insurance').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/insurance`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  saveProductCollateral(productId, data: any): Observable<any> {
    return this.getRecaptchaToken('product/collateral').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('productId', productId);
        if (data.file) {
          formData.append('file', data.file);
        }
        formData.append(`collateralName`, data.collateralName);

        formData.append('token', token);
        formData.append('index', data.index);
        formData.append('fid', data.fid);

        return this.httpClient.post(
          `${this.BASE_URL}/product/collateral`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  productCollaterals(productId, data: any): Observable<any> {
    return this.getRecaptchaToken('product/collateral').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('productId', productId);
        if (data.file1) {
          formData.append('file1', data.file1);
        }
        formData.append(`collateralName1`, data.name1);
        if (data.file2) {
          formData.append('file2', data.file2);
        }
        formData.append(`collateralName2`, data.name2);
        if (data.file3) {
          formData.append('file3', data.file3);
        }
        formData.append(`collateralName3`, data.name3);

        formData.append('token', token);

        return this.httpClient.post(
          `${this.BASE_URL}/product/collateral`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  supplierDocuments(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/documents').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        if (data.file1) {
          formData.append('file1', data.file1);
        }
        formData.append(`name1`, data.name1);
        if (data.file2) {
          formData.append('file2', data.file2);
        }
        formData.append(`name2`, data.name2);
        if (data.file3) {
          formData.append('file3', data.file3);
        }
        formData.append(`name3`, data.name3);

        formData.append('token', token);

        return this.httpClient.post(
          `${this.BASE_URL}/supplier/documents`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  saveSupplierDoc(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/document').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        if (data.file) {
          formData.append('file', data.file);
        }
        formData.append(`name`, data.name);

        formData.append('token', token);
        formData.append('index', data.index);
        formData.append('fid', data.fid);
        return this.httpClient.post(
          `${this.BASE_URL}/supplier/document`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  supplierInsuranceCert(file, certType, validDate, value): Observable<any> {
    /*if (!file) {
      return of(null);
    }*/
    return this.getRecaptchaToken('insurance/certificate').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        formData.append('certType', certType);
        formData.append('validDate', validDate);
        formData.append('value', value);
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/supplier/insurance/certificate`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  supplierInsuranceRem(certType): Observable<any> {
    return this.getRecaptchaToken('insurance/certificate/del').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/insurance/certificate/del`,
          { certType, token },
          this.httpOptionsMultipart
        )
      )
    );
  }

  supplierOther(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/other').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/other`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  getTpAccess(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/team/granttp`,
      this.httpOptions
    );
  }

  grantTpAccess(allow: boolean): Observable<any> {
    return this.getRecaptchaToken('supplier/team/granttp').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/team/granttp`,
          { allow, token },
          this.httpOptions
        )
      )
    );
  }

  addBusinessGroup(group: any): Observable<any> {
    return this.getRecaptchaToken('customer/businessgroups').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/customer/businessgroups`,
          { ...group, token },
          this.httpOptions
        )
      )
    );
  }
  updateBusinessGroup(_id: string, group: any): Observable<any> {
    return this.getRecaptchaToken(`customer/businessgroups/${_id}`).pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/customer/businessgroups/${_id}`,
          { ...group, token },
          this.httpOptions
        )
      )
    );
  }
  deleteBusinessGroups(_id: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/customer/businessgroups/${_id}`,
      this.httpOptions
    );
  }



  addTeamMembers(members: any): Observable<any> {
    return this.getRecaptchaToken('/team').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/team`,
          { members, token },
          this.httpOptions
        )
      )
    );
  }

  updateTeamSAML(id: string, member: any): Observable<any> {
    return this.getRecaptchaToken(`/team/saml`)
      .pipe(map((token) => ({ token, id, ...member })))
      .pipe(
        map((body) => ({ body, url: `${this.BASE_URL}/team/saml/${id}` }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  getSaml(): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.BASE_URL}/saml`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  updateTeamMember(member: any): Observable<any> {
    return this.getRecaptchaToken('/team').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/team`,
          { member, token },
          this.httpOptions
        )
      )
    );
  }

  supplierTeamReInvite(data: any): Observable<any> {
    return this.getRecaptchaToken('supplier/team/reinvite').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/team/reinvite`,
          { ...data, ...{ token } },
          this.httpOptions
        )
      )
    );
  }

  getMyTeam(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/customer/team/my`,
      this.httpOptions
    );
  }

  supplierTeamRemove(idMember: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/supplier/team/${idMember}`,
      this.httpOptions
    );
  }

  getSupplierTeam(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/team`,
      this.httpOptions
    );
  }

  getTeamGroups(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/team/groups`,
      this.httpOptions
    );
  }

  supplierStatus(): Observable<any> {
    return this.getRecaptchaToken('supplier/status').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/status`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  getSupplierStatus(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/status`,
      this.httpOptions
    );
  }

  getOnboardingStatus(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/onboarding/status`,
      this.httpOptions
    );
  }

  addProduct(data: any, draft: boolean, supplierId?: string): Observable<any> {
    return this.getRecaptchaToken('product').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/product`,
          { data, draft, token, supplierId },
          this.httpOptions
        )
      )
    );
  }

  duplicateProduct(productId: string): Observable<any> {
    return this.getRecaptchaToken(`product/${productId}/duplicate`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/product/${productId}/duplicate`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  removeProduct(productId: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/product/${productId}`,
      this.httpOptions
    );
  }

  searchTags(query: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/tag/search?query=${query}`,
      this.httpOptions
    );
  }

  addTag(name: any): Observable<any> {
    return this.getRecaptchaToken(`tag`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/tag`,
          { token, name },
          this.httpOptions
        )
      )
    );
  }

  searchSolutions(query: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/integratedsolution/search?query=${query}`,
      this.httpOptions
    );
  }

  addSolution(name: any, type): Observable<any> {
    return this.getRecaptchaToken(`integratedsolution`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/integratedsolution`,
          { token, name, type },
          this.httpOptions
        )
      )
    );
  }

  searchFrameworks(query: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/framework/search?query=${query}`,
      this.httpOptions
    );
  }

  addFramework(name: any): Observable<any> {
    return this.getRecaptchaToken(`framework`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/framework`,
          { token, name },
          this.httpOptions
        )
      )
    );
  }

  getProductVideo(productId: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/product/${productId}/video`,
      this.httpOptions
    );
  }

  removeProductVideo(productId: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/product/${productId}/video`,
      this.httpOptions
    );
  }

  uploadProductVideo(productId: string, video: File, title: string, description: string, supplierId?: string, fid?: string): Observable<any> {
    return this.getRecaptchaToken(`product/${productId}/video`).pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('video', video);
        formData.append('token', token);
        formData.append('title', title);
        formData.append('supplierId', supplierId);
        formData.append('description', description);
        formData.append('fid', fid);

        return this.httpClient.post(
          `${this.BASE_URL}/product/${productId}/video`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }


  updateProduct(id: string, data: any, draft: boolean, changeStatus = true): Observable<any> {
    return this.getRecaptchaToken('product').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/product`,
          { id, data, draft, token, changeStatus },
          this.httpOptions
        )
      )
    );
  }

  updateProductsRapid(data: any): Observable<any> {
    return this.getRecaptchaToken('products').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/products/rapid`,
          { data, token },
          this.httpOptions
        )
      )
    );
  }

  sendProductToreview(id: string): Observable<any> {
    return this.getRecaptchaToken(`product/${id}/send`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/product/${id}/send`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  getProducts(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/product`, this.httpOptions);
  }

  getMarketplaceProducts(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/product/marketplace`, this.httpOptions);
  }

  // searchProducts(query, filters, skip, take): Observable<any> {
  //   return this.getRecaptchaToken(`product/search`).pipe(
  //     switchMap((token) =>
  //       this.httpClient.post(`${this.BASE_URL}/product/search`, { token, query, filters, skip, take }, this.httpOptions)
  //     )
  //   );
  // }

  getNewSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/supplier/new`, this.httpOptions);
  }

  searchSuppliers(filters): Observable<any> {
    return this.getRecaptchaToken(`supplier/search`).pipe(
      switchMap((token) =>
        this.httpClient.post(`${this.BASE_URL}/supplier/search`, { token, filters }, this.httpOptions)
      )
    );
  }

  getAnalytics(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/supplier/analytics`, this.httpOptions);
  }

  getProductDetails(productId: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/product/details?productId=${productId}`,
      this.httpOptions
    );
  }

  getAdditionalProductDetails(productId: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/product/productDetails?productId=${productId}`,
      this.httpOptions
    );
  }

  getCompareProductDetails(productIds: string[]): Observable<any> {
    const ids = productIds.toString();
    return this.httpClient.get(
      `${this.BASE_URL}/product/compareProductDetails?ids=${ids}`,
      this.httpOptions
    );
  }

  getAssesments(supplierId?: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/assessments?supplierId=${supplierId}`,
      this.httpOptions
    );
  }

  addAssesment(
    baseLevel: string,
    file: File,
    globalId: string,
    fieldId: string,
    assessment: string,
    category: string,
    level: string,
    supplierId?: string
  ): Observable<any> {
    return this.getRecaptchaToken('product/assessment').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('baseLevel', baseLevel);
        formData.append('supplierId', supplierId);
        formData.append('globalId', globalId);
        formData.append('fieldId', fieldId);
        formData.append('assessment', assessment);
        formData.append('category', category);
        formData.append('level', level);
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/product/assessment`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  addInformationSecurity(
    id: string,
    answer: string,
    compliant: string,
    evidenceDescription: string,
    supplierId?: string
  ): Observable<any> {
    return this.getRecaptchaToken('product/informationsecurity').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/product/informationsecurity`,
          { supplierId, id, answer, compliant, evidenceDescription, token },
          this.httpOptionsMultipart
        )
      )
    );
  }

  addInformationSecurityEvidence(
    id: string,
    file: File,
    supplierId?: string
  ): Observable<any> {
    return this.getRecaptchaToken('product/informationsecurity/evidence').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('supplierId', supplierId);
        formData.append('id', id);
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/product/informationsecurity/evidence`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  addAssesmentValidDate(
    baseLevel: string,
    fieldId: string,
    assessment: string,
    category: string,
    validDate: string,
    supplierId?: string
  ): Observable<any> {
    return this.getRecaptchaToken('product/assessment/validate').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/product/assessment/validate`,
          {
            baseLevel,
            supplierId,
            fieldId,
            assessment,
            category,
            validDate,
            token,
          },
          this.httpOptions
        )
      )
    );
  }

  getAssessmentsURL(idAssessment: string): string {
    return `${this.BASE_URL}/product/assessment?id=${idAssessment}`;
  }
  getTemplateURL(idAssessment: string): string {
    return `${this.BASE_URL}/product/informationsecurity/template?id=${escape(
      idAssessment
    )}`;
  }
  removeAssesment(idAssessment: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/product/assessment?id=${idAssessment}`,
      this.httpOptions
    );
  }

  ndaSign(handshakeID: string): Observable<any> {
    return this.getRecaptchaToken('nda/sign').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/nda/sign`,
          { handshakeID, token },
          this.httpOptions
        )
      )
    );
  }
  pocSign(pocID: string): Observable<any> {
    return this.getRecaptchaToken('poc/sign').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/sign`,
          { pocID, token },
          this.httpOptions
        )
      )
    );
  }
  getPOCSignURL(id: string): string {
    return `${this.API_PREFIX}/poc/docusign?id=${id}`;
  }


  getNDASignURL(id: string): string {
    return `${this.API_PREFIX}/nda/docusign?id=${id}`;
  }

  getMembershipPlans(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/membership/plans`,
      this.httpOptions
    );
  }

  getTermsURL(period: string, opt: string): string {
    return `${this.BASE_URL}/membership/contract/pdf?&opt=${opt}&period=${period}`;
  }

  getBuyerContractTemplateURL(pocId: string, contractType: string): string {
    return `${this.BASE_URL}/poc/agreement/${pocId}/preview/${contractType}`;
  }

  paymentIntent(paymentPeriod: string, paymentId: string): Observable<any> {
    return this.getRecaptchaToken('payment/intent').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/payment/intent`,
          { paymentPeriod, paymentId, token },
          this.httpOptions
        )
      )
    );
  }

  payByCoupon(coupon: string): Observable<any> {
    return this.getRecaptchaToken('payment/coupon').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/payment/coupon`,
          { coupon, token },
          this.httpOptions
        )
      )
    );
  }

  getMembershipSubscription(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/subscription`,
      this.httpOptions
    );
  }

  getSupplierTermsSignURL(): string {
    return `${this.API_PREFIX}/supplier/terms/docusign`;
  }

  getTermsAndCongitions(mtype: string, period: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/supplier/terms/clickwrap?mtype=${mtype}&period=${period}`,
      this.httpOptions
    );
  }

  confirmTermsAndCongitions(clickwrapId: string, clientUserId: string): Observable<any> {
    return this.getRecaptchaToken('supplier/terms/clickwrap/confirm').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/terms/clickwrap/confirm`,
          { token, clickwrapId, clientUserId },
          this.httpOptions
        )
      )
    );
  }
  removeTermsAndCongitions(clickwrapId: string, clientUserId: string): Observable<any> {
    return this.getRecaptchaToken('supplier/terms/clickwrap/remove').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/terms/clickwrap/remove`,
          { token, clickwrapId, clientUserId },
          this.httpOptions
        )
      )
    );
  }

  migrationSetepUpdate(migrationStep: number): Observable<any> {
    return this.getRecaptchaToken('supplier/terms/migration').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/supplier/terms/migration`,
          { token, migrationStep },
          this.httpOptions
        )
      )
    );
  }




  getPKID(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/payment/pk`, this.httpOptions);
  }

  getConnectMe(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/connectme`, this.httpOptions);
  }

  getConnectMeEvents(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/connectme/events`,
      this.httpOptions
    );
  }
  getMessageEvents(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/message/events`,
      this.httpOptions
    );
  }
  hideMessage(msgId: string): Observable<any> {
    return this.getRecaptchaToken('message').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/message/${msgId}/hide`,
          { token },
          this.httpOptions
        )
      )
    );
  }

  connectMe(
    projectID: string,
    productID: string,
    reason: string
  ): Observable<any> {
    return this.getRecaptchaToken('connectme').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/connectme`,
          { projectID, productID, reason, token },
          this.httpOptions
        )
      )
    );
  }

  connectMeRespond(
    connectMeId: string,
    appove: boolean,
    message?: string
  ): Observable<any> {
    return this.getRecaptchaToken('connectme/respond').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/connectme/respond`,
          { connectMeId, appove, token, message },
          this.httpOptions
        )
      )
    );
  }
  connectMeApprove(
    connectMeId: string,
    appove: boolean,
    message?: string
  ): Observable<any> {
    return this.getRecaptchaToken(`connectme/${connectMeId}/approve`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/connectme/${connectMeId}/approve`,
          { connectMeId, appove, token, message },
          this.httpOptions
        )
      )
    );
  }

  contractSignedOffPlatform(
    pocId: string,
    appove: boolean
  ): Observable<any> {
    return this.getRecaptchaToken(`poc/agreement/${pocId}/signed`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/agreement/${pocId}/signed`,
          { appove, token },
          this.httpOptions
        )
      )
    );
  }





  //// SEARCH
  /*search/company/previous
  /search/company/toptech
  /search/company
  /search/product*/
  getLogo(idSupplier?: string) {
    return this.httpClient.get(`${this.BASE_URL}/search/company/logo?id=${idSupplier}`);
  }

  companySearchBasedOnPrev(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/search/company/previous`,
      this.httpOptions
    );
  }

  companySearchTopTech(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/search/company/toptech`,
      this.httpOptions
    );
  }

  companySearch(key?: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/search/company?key=${key}`,
      this.httpOptions
    );
  }

  companySearchList(key?: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/search/autocomplete/company/list?key=${key}`,
      this.httpOptions
    );
  }

  companySearchProductList(key?: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/search/autocomplete/product/list?key=${key}`,
      this.httpOptions
    );
  }

  companyPOCProductDetails(id: string, handshake?: boolean): Observable<any> {
    const urlParam = handshake === true ? `handshakeId=${id}` : `productId=${id}`;
    return this.httpClient.get(
      `${this.BASE_URL}/poc/product/details?${urlParam}`,
      this.httpOptions
    );
  }

  companyCreateProject(
    projectName: string,
    projectID: string,
    mainContactID: string,
    noticesAddress?: string
  ): Observable<any> {
    return this.getRecaptchaToken('poc/project').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/project`,
          { projectName, projectID, mainContactID, noticesAddress, token },
          this.httpOptions
        )
      )
    );
  }

  recallProject(
    pocID: string,
    handshakeID: string,
    productID: string,
    projectID: string,
  ): Observable<any> {
    return this.getRecaptchaToken('poc/project/recall').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/project/recall`,
          { pocID, handshakeID, productID, projectID, token },
          this.httpOptions
        )
      )
    );
  }

  setDraftProject(
    pocID: string,
    handshakeID: string,
    productID: string,
    projectID: string,
  ): Observable<any> {
    return this.getRecaptchaToken('poc/project/draft').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/project/draft`,
          { pocID, handshakeID, productID, projectID, token },
          this.httpOptions
        )
      )
    );
  }

  setArchiveProject(
    pocID: string,
    handshakeID: string,
    productID: string,
    projectID: string,
  ): Observable<any> {
    return this.getRecaptchaToken('poc/project/archive').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/project/archive`,
          { pocID, handshakeID, productID, projectID, token },
          this.httpOptions
        )
      )
    );
  }

  companygetGetProjects(evenEmpty: boolean, all: boolean, bankContextID: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/poc/project?evenEmpty=${evenEmpty}&all=${all}&customerID=${bankContextID}`,
      this.httpOptions
    );
  }

  supplierGetPOCs(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/poc/list`, this.httpOptions);
  }

  companyStartPOC(projectID: string, productID: string, handshakeID: string): Observable<any> {
    return this.getRecaptchaToken('poc/start').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/start`,
          { projectID, productID, handshakeID, token },
          this.httpOptions
        )
      )
    );
  }

  companySavePOC(
    pocID: string,
    status?: string,
    step?: Number
  ): Observable<any> {
    return this.getRecaptchaToken('poc/save').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/save`,
          { pocID, status, step, token },
          this.httpOptions
        )
      )
    );
  }


  companyPOCAddQuestion(
    pocID: string,
    questionScheetID: string,
    sectionID: string,
    challengeFor: Array<string>,
    scheduleTitle: string,
    onPOC: boolean,
    onReview: boolean,
    negotiable: boolean,
    initialAnswer: string,
    questionText?: string,
    info?: string,
    negativeAnswer?: string,
    mustBe?: any
  ): Observable<any> {
    /*return this.getRecaptchaToken("poc/question").pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/question`,
          {
            token,
            pocID,
            questionScheetID,
            sectionID,
            challengeFor,
            scheduleTitle,
            onPOC,
            onReview,
            negotiable,
            initialAnswer,
            questionText,
            info,
            negativeAnswer,
            mustBe,
          },
          this.httpOptions
        )
      )
    );*/
    return this.httpClient.post(
      `${this.BASE_URL}/poc/question`,
      {
        pocID,
        questionScheetID,
        sectionID,
        challengeFor,
        scheduleTitle,
        onPOC,
        onReview,
        negotiable,
        initialAnswer,
        questionText,
        info,
        negativeAnswer,
        mustBe,
      },
      this.httpOptions
    ).pipe(map((res) => res));


    // return this.getRecaptchaToken('poc/question')
    //   .pipe(switchMap(token => this.httpClient.post(`${this.BASE_URL}/poc/question`, { pocID, questionScheetID, sectionID, challengeFor, scheduleTitle, onPOC, onReview, negotiable, initialAnswer, questionText, info, negativeAnswer, mustBe, token }, this.httpOptions)));
  }

  companyPOCAnswer(
    pocID: string,
    questionScheetID: string,
    questionID: string,
    answer: any,
    date?: string,
    onBehalf?: string,
    comment?: string,
    challengeTo?: boolean,
    approved?: boolean,
    tbc?: boolean,
    status?: string,
    internalStatus?: string,
    internalStatusLevel?: number,
    fromFarEnd?: boolean
  ): Observable<any> {
    /*return this.getRecaptchaToken("poc/answer").pipe(
       switchMap((token) =>
         this.httpClient.post(
           `${this.BASE_URL}/poc/answer`,
           {
             token,
             pocID,
             questionScheetID,
             questionID,
             answer,
             date,
             onBehalf,
             comment,
             challengeTo,
             approved,
             tbc,
             status,
             internalStatus,
             internalStatusLevel,
             fromFarEnd
           },
           this.httpOptions
         )
       )
     );*/
    return this.httpClient.post(
      `${this.BASE_URL}/poc/answer`,
      {
        pocID,
        questionScheetID,
        questionID,
        answer,
        date,
        onBehalf,
        comment,
        challengeTo,
        approved,
        tbc,
        status,
        internalStatus,
        internalStatusLevel,
        fromFarEnd
      },
      this.httpOptions
    ).pipe(map((res) => res));
    /* return this.httpClient.post(
       `${this.BASE_URL}/poc/answer`,
       {
         pocID,
         questionScheetID,
         questionID,
         answer,
         date,
         onBehalf,
         comment,
         challengeTo,
         approved,
         tbc,
         status,
         internalStatus,
         internalStatusLevel,
         fromFarEnd
       },
       this.httpOptions
     );*/
    // return this.getRecaptchaToken('poc/answer')
    //   .pipe(switchMap(token => this.httpClient.post(`${this.BASE_URL}/poc/answer`, { pocID, questionScheetID, questionID, answer, date, onBehalf, comment, challengeTo, approved, tbc, status, internalStatus, internalStatusLevel }, this.httpOptions)));
  }

  supplierPOCAnswer(
    pocID: string,
    questionScheetID: string,
    questionID: string,
    answer: any,
    date?: string,
    onBehalf?: string,
    comment?: string,
    challengeTo?: boolean,
    approved?: boolean,
    tbc?: boolean,
    status?: string,
    internalStatus?: string,
    internalStatusLevel?: number,
  ): Observable<any> {
    return this.getRecaptchaToken('poc/answer/supplier').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/answer/supplier`,
          {
            pocID,
            questionScheetID,
            questionID,
            answer,
            date,
            onBehalf,
            comment,
            challengeTo,
            approved,
            tbc,
            status,
            internalStatus,
            internalStatusLevel,
            token
          },
          this.httpOptions
        )
      )
    );
  }

  companyPOCAnswerStatus(
    answerID: string,
    questionID: string,
    status: string,
    internalStatus: string,
    internalStatusLevel: number
  ): Observable<any> {
    return this.getRecaptchaToken('poc/answer/status').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/answer/status`,
          {
            answerID,
            questionID,
            status,
            internalStatus,
            internalStatusLevel,
            token,
          },
          this.httpOptions
        )
      )
    );
  }

  companyPOCApproveAll(pocID: string): Observable<any> {
    return this.getRecaptchaToken('poc/approve/all').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/approve/all`,
          { pocID, token },
          this.httpOptions
        )
      )
    );
  }

  companyPOCSubmitAll(pocID: string): Observable<any> {
    return this.getRecaptchaToken('poc/submit/all').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/submit/all`,
          { pocID, token },
          this.httpOptions
        )
      )
    );
  }

  companyPOCSubmitFeAll(pocID: string, handshakeID: string): Observable<any> {
    return this.getRecaptchaToken('poc/submit/farend/all').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/submit/farend/all`,
          { pocID, handshakeID, token },
          this.httpOptions
        )
      )
    );
  }

  /*public companyPOCAnswerAgree( pocID: string, questionScheetID: string, questionID: string,  answer: any, date?: string, onBehalf?: string, comment?: string, challengeTo?: boolean ){
      return this.httpClient.post(`${this.BASE_URL}/poc/answer/agree`, { pocID, questionScheetID, questionID, answer, date, onBehalf, comment, challengeTo }, this.httpOptions);
  };*/
  companyPOCGetAnswers(pocID: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/poc/answer?pocID=${pocID}`,
      this.httpOptions
    );
  }

  companyPOCGetSummary(pocID: string): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/poc/summary/${pocID}`,
      this.httpOptions
    );
  }





  /*  public companyPOCApproveAnswer(answerID: string) {
        return this.httpClient.post(`${this.BASE_URL}/poc/answer/approve`, { answerID }, this.httpOptions);
    };
    public companyPOCSubmit(answerID: string){
        return this.httpClient.post(`${this.BASE_URL}/poc/answer/submit`, { answerID }, this.httpOptions);
    };
    public companyPOCUndo(answerID: string){
        return this.httpClient.post(`${this.BASE_URL}/poc/answer/undo`, { answerID }, this.httpOptions);
    };*/

  companyPOCDeclineAndAddAnswer(
    answerID: string,
    questionID: string,
    answer: any,
    comment?: string
  ): Observable<any> {
    return this.getRecaptchaToken('poc/answer/decline').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/poc/answer/decline`,
          { answerID, questionID, answer, comment, token },
          this.httpOptions
        )
      )
    );
  }

  /*public companyProductsSearch( key?: string ){
      return this.httpClient.get(`${this.BASE_URL}/search/company?key=${key}`, this.httpOptions);
  };*/
  productSearch(
    all: boolean,
    freeText?: string,
    region?: Array<string>,
    productType?: Array<string>,
    functionality?: Array<string>,
    suppliers?: Array<string>,
    products?: Array<string>,
    tags?: Array<string>,
    functionalityText?: string,
    compilance?: any,
    membership?: any,
    insurance?: any,
    useCase?: boolean,
    rapidPOC?: boolean,
    useCaseText?,
    supplierMaturity?: any,
    pocCharge?: any
  ): Observable<any> {
    return this.getRecaptchaToken('search/product').pipe(
      switchMap((token) => {
        const payload = {
          all,
          freeText,
          region,
          productType,
          functionality,
          suppliers,
          products,
          tags,
          functionalityText,
          compilance,
          membership,
          insurance,
          useCase,
          rapidPOC,
          useCaseText,
          token,
          supplierMaturity,
          pocCharge,
        };
        return this.httpClient.post(
          `${this.BASE_URL}/search/product`,
          payload,
          this.httpOptions
        );
      })
    );
  }

  adminGetSuppliers(): Observable<Supplier[]> {
    return this.httpClient
      .get<Supplier[]>(`${this.BASE_URL}/admin/suppliers`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetCompliances(): Observable<Compliance[]> {
    return this.httpClient
      .get<Compliance[]>(`${this.BASE_URL}/admin/compliance`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetSupplierItem(supplierId: string): Observable<Supplier> {
    return this.httpClient
      .get<Supplier>(
        `${this.BASE_URL}/admin/suppliers/${supplierId}`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetSupplierReview(supplierId: string): Observable<SupplierReview> {
    return this.httpClient
      .get<SupplierReview>(
        `${this.BASE_URL}/admin/supplier/${supplierId}/review`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetSupplierProducts(supplierId: string): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(
        `${this.BASE_URL}/admin/products?supplierId=${supplierId}`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.BASE_URL}/admin/products`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetProductItem(productId: string): Observable<Product> {
    return this.httpClient
      .get<Product>(
        `${this.BASE_URL}/admin/product/${productId}`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetProductReview(productId: string): Observable<ProductReview> {
    return this.httpClient
      .get<ProductReview>(
        `${this.BASE_URL}/admin/product/${productId}/review`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminApproveProduct(productId: string, body): Observable<any> {
    return this.getRecaptchaToken(`admin/product/${productId}/approve`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/admin/product/${productId}/approve`,
          { ...body, token },
          this.httpOptions
        )
      )
    );
  }

  adminRejectProduct(productId: string, body): Observable<any> {
    return this.getRecaptchaToken(`admin/product/${productId}/reject`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/admin/product/${productId}/reject`,
          { ...body, token },
          this.httpOptions
        )
      )
    );
  }

  adminApproveSupplier(supplierId: string, body): Observable<any> {
    return this.getRecaptchaToken(`admin/supplier/${supplierId}/approve`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/admin/supplier/${supplierId}/approve`,
          { ...body, token },
          this.httpOptions
        )
      )
    );
  }

  adminRejectSupplier(supplierId: string, body): Observable<any> {
    return this.getRecaptchaToken(`admin/supplier/${supplierId}/reject`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/admin/supplier/${supplierId}/reject`,
          { ...body, token },
          this.httpOptions
        )
      )
    );
  }

  adminGetComplianceAssessment(
    complianceId: string
  ): Observable<ComplianceItems> {
    return this.httpClient
      .get<ComplianceItems>(
        `${this.BASE_URL}/admin/compliance/${complianceId}`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetComplianceInformationSecurity(complianceId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.BASE_URL}/admin/compliance/${complianceId}/information-security`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetComplianceChecklist(complianceId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.BASE_URL}/admin/compliance/${complianceId}/checklist`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetAccessLog(): Observable<AccessLog[]> {
    return this.httpClient
      .get<AccessLog[]>(`${this.BASE_URL}/admin/users/log`, this.httpOptions)
      .pipe(map((res) => res.body));
  }


  adminCreateUser(body: UserDTO): Observable<any> {
    return this.getRecaptchaToken(`admin/users/add`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/users/add`,
            { ...body, token },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => res.body));
  }

  adminLockUser(id: string): Observable<any> {
    return this.getRecaptchaToken(`admin/users/${id}/lock`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/users/${id}/lock`,
            { token },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUnlockUser(id: string): Observable<any> {
    return this.getRecaptchaToken(`admin/users/${id}/unlock`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/users/${id}/unlock`,
            { token },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => res.body));
  }

  adminDestroyUserSession(id: string): Observable<any> {
    return this.getRecaptchaToken(`admin/users/session/${id}/destroy`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/users/session/${id}/destroy`,
            { token },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => res.body));
  }

  adminDeleteUser(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/admin/users/${id}`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetAccessManagement(): Observable<AccessManagement[]> {
    return this.httpClient
      .get<AccessManagement[]>(`${this.BASE_URL}/admin/users`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetErrorHandling(): Observable<ErrorHandling[]> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/admin/server/log`, this.httpOptions)
      .pipe(map((res) => res.body));
  }
  getContractTemplateURL(id: string): string {
    return `${this.BASE_URL}/admin/customer/contracttemplete/file?id=${id}`;
  }
  removeContractTemplate(id: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/admin/customer/contracttemplete/file?id=${id}`,
      this.httpOptions
    );
  }
  adminUploadContractTemplete(
    id: string,
    contractType: string,
    file?: File
  ): Observable<any> {
    return this.getRecaptchaToken('admin/customer/contracttemplete').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('contractType', contractType);
        formData.append('id', id);
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/admin/customer/contracttemplete`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  adminGetContractTempletes(buyerId: string): Observable<BuyerContractTemplate[]> {
    return this.httpClient
      .get<BuyerContractTemplate[]>(`${this.BASE_URL}/admin/customer/contracttemplete/${buyerId}`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerOnboarding(entity: BuyerEntity): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/add`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/customer/add`,
            { token, ...entity },
            this.httpOptions
          )
        )
      )
      .pipe(map((res) => res.body));
  }

  adminGetBuyer(id: string): Observable<BuyerForm> {
    return this.httpClient
      .get<BuyerForm>(`${this.BASE_URL}/admin/customer/${id}`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  adminGetBuyerEntity(id: string): Observable<BuyerEntity> {
    return this.httpClient
      .get<BuyerEntity>(
        `${this.BASE_URL}/admin/customer/${id}/entity`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminGetBuyerInvoices(id: string): Observable<BuyerInvoices> {
    return this.httpClient
      .get<BuyerInvoices>(
        `${this.BASE_URL}/admin/customer/${id}/invoices`,
        this.httpOptions
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerEntity(id: string, entity: BuyerEntity): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/${id}`)
      .pipe(map((token) => ({ token, ...entity })))
      .pipe(
        map((body) => ({ body, url: `${this.BASE_URL}/admin/customer/${id}` }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerInvoices(
    id: string,
    invoices: BuyerInvoices
  ): Observable<BuyerInvoices> {
    return this.getRecaptchaToken(`admin/customer/${id}/invoices`)
      .pipe(map((token) => ({ token, ...invoices })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invoices`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<BuyerInvoices>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerInvoices(
    id: string,
    invoices: BuyerInvoices
  ): Observable<BuyerInvoices> {
    return this.getRecaptchaToken(`admin/customer/${id}/invoices`)
      .pipe(map((token) => ({ token, ...invoices })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invoices`,
        }))
      ) /// ${invoices._id}
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put<BuyerInvoices>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerGroup(
    id: string,
    { acceptGroupEntityDefinition, customGroupEntityDefinition }: BuyerGroup
  ): Observable<BuyerGroup> {
    return this.getRecaptchaToken(`admin/customer/${id}/group`)
      .pipe(
        map((token) => ({
          token,
          acceptGroupEntityDefinition,
          customGroupEntityDefinition,
        }))
      )
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/group`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<BuyerGroup>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerGroup(
    id: string,
    {
      acceptGroupEntityDefinition,
      customGroupEntityDefinition,
      _id,
    }: BuyerGroup
  ): Observable<BuyerGroup> {
    return this.getRecaptchaToken(`admin/customer/${id}/group`)
      .pipe(
        map((token) => ({
          token,
          acceptGroupEntityDefinition,
          customGroupEntityDefinition,
        }))
      )
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/group`,
        }))
      ) /// ${_id}
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put<BuyerGroup>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerSanctions(
    id: string,
    sanctions: BuyerSanctions
  ): Observable<BuyerSanctions> {
    return this.getRecaptchaToken(`admin/customer/${id}/sanctions`)
      .pipe(map((token) => ({ token, ...sanctions })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/sanctions`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<BuyerSanctions>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerSanctions(
    id: string,
    sanctions: BuyerSanctions
  ): Observable<BuyerSanctions> {
    return this.getRecaptchaToken(`admin/customer/${id}/sanctions`) /// ${sanctions._id}
      .pipe(map((token) => ({ token, ...sanctions })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/sanctions`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put<BuyerSanctions>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerSaml(id: string, isSamlAuthenticated: BuyerSaml): Observable<BuyerSaml> {
    return this.getRecaptchaToken(`admin/customer/${id}/isSamlAuthenticated`)
      .pipe(map((token) => ({ token, ...isSamlAuthenticated })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/isSamlAuthenticated`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) => {
          const bodyNew = { isSamlAuthenticated: body.isSamlAuthenticated, token: body.token };
          return this.httpClient.post<BuyerSaml>(url, bodyNew, this.httpOptions);
        }
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerSaml(id: string, isSamlAuthenticated: BuyerSaml): Observable<BuyerSaml> {
    return this.getRecaptchaToken(`admin/customer/${id}/isSamlAuthenticated`) /// ${dummy._id}
      .pipe(map((token) => ({ token, ...isSamlAuthenticated })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/isSamlAuthenticated`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) => {
          const bodyNew = { isSamlAuthenticated: body.isSamlAuthenticated, token: body.token };
          return this.httpClient.post<BuyerSaml>(url, bodyNew, this.httpOptions);
        }
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerInvite(
    id: string,
    invite: BuyerInvite
  ): Observable<BuyerInvite> {
    return this.getRecaptchaToken(`admin/customer/${id}/invite`)
      .pipe(map((token) => ({ token, ...invite })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invite`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<BuyerInvite>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerInvite(
    id: string,
    invite: BuyerInvite
  ): Observable<BuyerInvite> {
    return this.getRecaptchaToken(`admin/customer/${id}/invite`)
      .pipe(map((token) => ({ token, ...invite })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invite`,
        }))
      ) /// ${invite._id}
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put<BuyerInvite>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateBuyerDummy(id: string, dummy: BuyerDummy): Observable<BuyerDummy> {
    return this.getRecaptchaToken(`admin/customer/${id}/dummy`)
      .pipe(map((token) => ({ token, ...dummy })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/dummy`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<BuyerDummy>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateBuyerDummy(id: string, dummy: BuyerDummy): Observable<BuyerDummy> {
    return this.getRecaptchaToken(`admin/customer/${id}/dummy`) /// ${dummy._id}
      .pipe(map((token) => ({ token, ...dummy })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/dummy`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put<BuyerDummy>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateCompanyEntity(id: string, entity: BuyerEntity): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/${id}/entity`)
      .pipe(map((token) => ({ token, ...entity })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/entity`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateCompanyEntity(id: string, entity: BuyerEntity): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/${id}`)
      .pipe(map((token) => ({ token, ...entity })))
      .pipe(
        map((body) => ({ body, url: `${this.BASE_URL}/admin/customer/${id}` }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateCustomerSAML(id: string, entity: any): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/saml/${id}`)
      .pipe(map((token) => ({ token, ...entity })))
      .pipe(
        map((body) => ({ body, url: `${this.BASE_URL}/admin/customer/saml/${id}` }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminCreateCompanyInvoices(
    id: string,
    invoices: BuyerInvoices
  ): Observable<any> {
    return this.getRecaptchaToken(`admin/customer/${id}/invoices`)
      .pipe(map((token) => ({ token, ...invoices })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invoices`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminUpdateCompanyInvoices(
    id: string,
    invoices: BuyerInvoices
  ): Observable<any> {
    return this.getRecaptchaToken(
      `admin/customer/${id}/invoices/${invoices._id}`
    )
      .pipe(map((token) => ({ token, ...invoices })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/admin/customer/${id}/invoices/${invoices._id}`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.put(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }

  adminGetCustomers(): Observable<Customer[]> {
    return this.httpClient
      .get<Customer[]>(`${this.BASE_URL}/admin/customer`, this.httpOptions)
      .pipe(map((res) => res.body));
  }

  dashboardGetKPIs({
    dateFrom,
    dateTo,
    country,
    bankContext
  }: DashboardFilters): Observable<DashboardKPIs> {
    const params = pickBy(
      {
        country,
        dateFrom: dateFrom && dateFrom.getTime().toString(),
        dateTo: dateTo && dateTo.getTime().toString(),
        customerID: bankContext
      },
      (v) => !isUndefined(v)
    );
    return this.httpClient
      .get<DashboardKPIs>(`${this.BASE_URL}/dashboard/kpis`, {
        ...this.httpOptions,
        params,
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetAlerts({
    dateFrom,
    dateTo,
    country,
    bankContext
  }: DashboardFilters): Observable<DashboardAlerts> {




    /*return this.httpClient.get<DashboardAlerts>(`${this.BASE_URL}/dashboard/alerts`, this.httpOptions)
      .pipe(map(res => res.body));*/

    const params = pickBy(
      {
        country,
        dateFrom: dateFrom && dateFrom.getTime().toString(),
        dateTo: dateTo && dateTo.getTime().toString(),
        customerID: bankContext
      },
      (v) => !isUndefined(v)
    );
    return this.httpClient.get<DashboardAlerts>(`${this.BASE_URL}/dashboard/alerts`,
      {
        ...this.httpOptions,
        params,
      })
      .pipe(map(res => res.body));

  }

  dashboardGetTrends({
    dateFrom,
    dateTo,
    country,
    bankContext
  }: DashboardFilters): Observable<DashboardSecurityTrends> {
    const params = pickBy(
      {
        country,
        dateFrom: dateFrom && dateFrom.getTime().toString(),
        dateTo: dateTo && dateTo.getTime().toString(),
        customerID: bankContext
      },
      (v) => !isUndefined(v)
    );
    return this.httpClient
      .get<DashboardSecurityTrends>(`${this.BASE_URL}/dashboard/trends`, {
        ...this.httpOptions,
        params,
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetProjects({
    dateFrom,
    dateTo,
    country,
    bankContext
  }: DashboardFilters): Observable<DashboardProject[]> {
    const params = pickBy(
      {
        country,
        dateFrom: dateFrom && dateFrom.getTime().toString(),
        dateTo: dateTo && dateTo.getTime().toString(),
        customerID: bankContext
      },
      (v) => !isUndefined(v)
    );
    return this.httpClient
      .get<DashboardProject[]>(`${this.BASE_URL}/dashboard/projects`, {
        ...this.httpOptions,
        params,
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetResources({
    dateFrom,
    dateTo,
    country,
    bankContext
  }: DashboardFilters): Observable<DashboardResources> {
    const params = pickBy(
      {
        country,
        dateFrom: dateFrom && dateFrom.getTime().toString(),
        dateTo: dateTo && dateTo.getTime().toString(),
        customerID: bankContext
      },
      (v) => !isUndefined(v)
    );
    return this.httpClient
      .get<DashboardResources>(`${this.BASE_URL}/dashboard/resources`, {
        ...this.httpOptions,
        params,
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetMarketPreview(customerID?: string): Observable<MarketPreview[]> {
    const params = pickBy({ customerID }, (v) => !isUndefined(v));
    return this.httpClient
      .get<MarketPreview[]>(`${this.BASE_URL}/dashboard/kpis/market`, {
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetSearchesPreview(customerID?: string): Observable<SearchesPreview[]> {
    const params = pickBy({ customerID }, (v) => !isUndefined(v));
    return this.httpClient
      .get<SearchesPreview[]>(`${this.BASE_URL}/dashboard/kpis/searches`, {
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetTechnologyPreview(customerID?: string): Observable<TechnologyPreview[]> {
    const params = pickBy({ customerID }, (v) => !isUndefined(v));
    return this.httpClient
      .get<TechnologyPreview[]>(`${this.BASE_URL}/dashboard/kpis/technology`, {
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetTrendsPreview(customerID?: string): Observable<TrendsPreview[]> {
    const params = pickBy({ customerID }, (v) => !isUndefined(v));
    return this.httpClient
      .get<TrendsPreview[]>(`${this.BASE_URL}/dashboard/trends/details`, {
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  getProductTags(): Observable<any> {
    return this.httpClient
      .get(`${this.BASE_URL}/search/autocomplete/product-tags`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  getEntieties(): Observable<any> {
    return this.httpClient
      .get(`${this.BASE_URL}/customer/entities`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  getBusinessGroups(): Observable<any> {
    return this.httpClient
      .get(`${this.BASE_URL}/customer/businessgroups`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  getBanksShortlist(): Observable<any> {
    return this.httpClient
      .get(`${this.BASE_URL}/admin/customer/shortlist`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  feedbackGetSchema(projectId: string): Observable<FeedbackSchema> {
    return this.httpClient
      .get<FeedbackSchema>(`${this.BASE_URL}/customer/feedback/${projectId}`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  feedbackUpdateFeedbackLoop(projectId: string, answers: FeedbackModel, draft: boolean): Observable<FeedbackModel> {
    return this.getRecaptchaToken(`customer/feedback/${projectId}`)
      .pipe(map((token) => ({ token, answers, draft })))
      .pipe(
        map((body) => ({
          body,
          url: `${this.BASE_URL}/customer/feedback/${projectId}`,
        }))
      )
      .pipe(
        switchMap(({ body, url }) =>
          this.httpClient.post<FeedbackModel>(url, body, this.httpOptions)
        )
      )
      .pipe(map((res) => res.body));
  }


  customerInviteSupplier(data: any): Observable<any> {
    return this.getRecaptchaToken('invitesuppliers/invite').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/invitesuppliers/invite`,
          { ...data, token },
          this.httpOptions
        )
      )
    );
  }

  private getRecaptchaToken(action: string): Observable<string> {
    return this.recaptchaV3Service.execute(action);
  }


  // Get Tables
  adminGetTable(type: string): Observable<any> {
    // TODO: fix store
    const params = pickBy({ type }, (v: string | null) => !isUndefined(v));
    return this.httpClient
      .get<Table[]>(
        `${this.BASE_URL}/admin/table`, {
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  adminUpdateTable(type: string, entity: any): Observable<any> {
    // TODO: fix store
    // TODO: validate unique name field in the components
    const params = pickBy({ type }, (v: string | null) => !isUndefined(v));
    const payload = {
      tag: null,
      solution: null,
      taxonomy: null,
      framework: null
    };
    switch (type) {
      case Types.Tags:
        payload.tag = entity;
        break;
      case Types.Solutions:
        payload.solution = entity;
        break;
      case Types.Taxonomies:
        payload.taxonomy = entity;
        break;
      case Types.Frameworks:
        payload.framework = entity;
        break;
      default:
        break;
    }
    return this.getRecaptchaToken(`/admin/table/update`)
      .pipe(
        switchMap((token) =>
          this.httpClient.put(
            `${this.BASE_URL}/admin/table/update`,
            { entity: payload, token },
            {
              ...this.httpOptions,
              params
            }
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  adminCreateTable(type: string, entity: any): Observable<any> {
    const params = pickBy({ type }, (v: string | null) => !isUndefined(v));
    const payload = {
      tag: null,
      solution: null,
      taxonomy: null,
      framework: null
    };

    switch (type) {
      case Types.Tags:
        payload.tag = entity;
        break;
      case Types.Solutions:
        payload.solution = entity;
        break;
      case Types.Taxonomies:
        payload.taxonomy = {
          data: entity,
          _id: entity.level === 'lvl_1' ? null : entity._id,
          _subId: entity.level === 'lvl_1' ? null : entity._subId,
          subLevel: entity.level
        };
        break;
      case Types.Frameworks:
        payload.framework = entity;
        break;
      default:
        break;
    }

    return this.getRecaptchaToken(`/admin/table/create`)
      .pipe(
        switchMap((token) =>
          this.httpClient.post(
            `${this.BASE_URL}/admin/table/create`,
            { entity: payload, token },
            {
              ...this.httpOptions,
              params
            }
          )
        )
      )
      .pipe(map((res) => {
        return res.body;
      }));
  }

  adminDeleteTable(tableType: string, payload: any): Observable<any> {
    const query = {
      type: null,
      name: null,
      entity: null,
      subEntity: null,
    };
    switch (tableType) {
      case Types.Tags:
        query.entity = payload.entity;
        break;
      case Types.Solutions:
        query.type = payload.type || null;
        query.name = payload.name || null;
        break;
      case Types.Taxonomies:
        query.entity = payload.mainParentId;
        query.subEntity = payload.subEntity || null; // TODO
        query.type = payload.level || null; // TODO lvl_1, lvl_2 lvl_3
        break;
      case Types.Frameworks:
        query.entity = payload.entity;
        break;
      default:
        break;
    }
    return this.httpClient.delete(
      `${this.BASE_URL}/admin/table?tableType=${tableType}&entity=${query.entity}&subEntity=${query.subEntity}&type=${query.type}&name=${query.name}`,
      this.httpOptions,
    );
  }

  dashboardGetProducts(customerID?: string, chunk: string = 'partial'): Observable<any[]> {
    chunk = String(chunk);
    const params = pickBy({
      chunk
    }, (v) => !isUndefined(v));
    return this.httpClient
      .get<MarketPreview[]>(`${this.BASE_URL}/dashboard/new-products`, { // new-products
        ...this.httpOptions,
        params
      })
      .pipe(map((res) => res.body));
  }

  // Watchlist START
  dashboardGetFavoriteProducts(customerID: string | undefined | null): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/dashboard/watchlists?customerID=${customerID}`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  dashboardGetFavoriteProduct(customerID: string | undefined | null, productID: string): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/dashboard/watchlist/product?customerID=${customerID}&productID=${productID}`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  dashboardRemoveAllFavoriteProducts(customerID?: string | undefined | null): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/dashboard/watchlists?customerID=${customerID}`,
      this.httpOptions
    );
  }

  dashboardAddFavoriteProduct(customerID: string | undefined | null, productID: string, supplierID: string): Observable<any> {
    return this.getRecaptchaToken('dashboard/watchlist/product').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/dashboard/watchlist/product`,
          { customerID, productID, supplierID, token },
          this.httpOptions
        )
      )
    );
  }

  dashboardRemoveFavoriteProduct(customerID: string | undefined | null, productID: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/dashboard/watchlist/product?customerID=${customerID}&productID=${productID}`,
      this.httpOptions
    );
  }
  // Watchlist END

  // Redesign Alert START
  getAlertProducts(customerID?: string | null | undefined): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/dashboard/alert/products`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }
  // Redesign Alert END

  getERQ(supplierID?: string | null | undefined): Observable<any> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/erq?supplierID=${supplierID}`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  getsuplierERQs(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.BASE_URL}/erqs`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  postERQ(type: string, data: any, supplierID?: string | undefined | null): Observable<any> {
    return this.getRecaptchaToken('erq/update').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/erq/update`,
          { type, data, token },
          this.httpOptions
        )
      )
    );
  }

  saveFileErq(type: string, field: string, data: any): Observable<any> {
    return this.getRecaptchaToken('erq/file').pipe(
      switchMap((token) => {
        const formData: FormData = new FormData();
        formData.append('file', data.file || null);
        formData.append(`fileName`, data.fileName);
        formData.append(`formType`, type);
        formData.append(`formField`, field);
        formData.append('fid', data.fid);
        formData.append('token', token);
        return this.httpClient.post(
          `${this.BASE_URL}/erq/file`,
          formData,
          this.httpOptionsMultipart
        );
      })
    );
  }

  getPrSupExport(): Observable<any> {
    return this.httpClient
      .get<Table[]>(
        `${this.BASE_URL}/admin/table/export`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  runMigrationProcess(products: any, suppliers: any): Observable<any> {
    return this.getRecaptchaToken('admin/table/import').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/admin/table/import`,
          { products, suppliers, token },
          this.httpOptions
        )
      )
    );
  }

  postRequestInfo(data: any[]): Observable<any> {
    return this.getRecaptchaToken('requestinfo/add').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/requestinfo/add`,
          { data, token },
          this.httpOptions
        )
      )
    );
  }

  getMyWatchLists(filters: any = {}): Observable<any> {
    return this.getRecaptchaToken('watchlists/mylists').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/watchlists/mylists`,
          { ...filters, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  getCompanyWatchLists(): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}/watchlists/companylists`,
      this.httpOptions
    ).pipe(map((res) => res.body));
  }

  createWatchList(data: any): Observable<any> {
    return this.getRecaptchaToken('watchlists').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/watchlists`,
          { ...data, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  updateWatchlist(id: string, data: any): Observable<any> {
    return this.getRecaptchaToken(`watchlists/${id}`).pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/watchlists/${id}`,
          { ...data, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  removeWatchlist(id: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/watchlists/${id}`,
      this.httpOptions
    ).pipe(map((res) => res.body));
  }

  // addCollaborator(data: any): Observable<any> {
  //   return this.getRecaptchaToken('watchlists/collaborators').pipe(
  //     switchMap((token) =>
  //       this.httpClient.post(
  //         `${this.BASE_URL}/watchlists/collaborators`,
  //         { ...data, token },
  //         this.httpOptions
  //       ).pipe(map((res) => res.body))
  //     )
  //   );
  // }

  inviteCollaborator(watchlistId: string, data: any): Observable<any> {
    return this.getRecaptchaToken(`watchlists/${watchlistId}/collaborators/invite`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/watchlists/${watchlistId}/collaborators/invite`,
          { ...data, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  leaveCollaboratorFromWatchlist(watchlistId: string, collaboratorId: string): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_URL}/watchlists/${watchlistId}/collaborators/${collaboratorId}`,
      this.httpOptions
    ).pipe(map((res) => res.body));
  }

  addProductsToWatchlist(watchlistId: string, products: string[]): Observable<any> {
    return this.getRecaptchaToken(`watchlists/${watchlistId}/products`).pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/watchlists/${watchlistId}/products`,
          { products, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  removeProductsFromWatchlist(data): Observable<any> {
    return this.getRecaptchaToken('watchlists/productsremove').pipe(
      switchMap((token) =>
        this.httpClient.post(
          `${this.BASE_URL}/watchlists/productsremove`,
          { data, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  getInviteSuppliersData(): Observable<any> {
    return this.httpClient
      .get<InviteSuppliersTableModel[]>(`${this.BASE_URL}/invitesuppliers/records`, {
        ...this.httpOptions,
      })
      .pipe(map((res) => res.body));
  }

  invitationRequestDate(invitationId: string): Observable<any> {
    return this.getRecaptchaToken('invitesuppliers/requestupdate').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/invitesuppliers/requestupdate`,
          { invitationId, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  invitationChangeStatus(invitationId: string, status: InvitationStatus): Observable<any> {
    return this.getRecaptchaToken('invitesuppliers/changestatus').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/invitesuppliers/changestatus`,
          { invitationId, status, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }

  invitationUpdateNote(invitationId: string, tppNote: string): Observable<any> {
    return this.getRecaptchaToken('invitesuppliers/updatenote').pipe(
      switchMap((token) =>
        this.httpClient.put(
          `${this.BASE_URL}/invitesuppliers/updatenote`,
          { invitationId, tppNote, token },
          this.httpOptions
        ).pipe(map((res) => res.body))
      )
    );
  }
}


