import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ClickOutsideModule } from 'ng-click-outside';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { RatingModule } from 'ng-starrating';
import { NgxDropzoneModule } from 'ngx-dropzone';

const modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  HttpClientModule,
  FlexLayoutModule,
  ChartsModule,
  AngularResizedEventModule,
  ClickOutsideModule,
  RatingModule,
  TimePickerModule,
  PasswordStrengthMeterModule,
  BrowserModule,
  MatToolbarModule,
  MatBadgeModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatGridListModule,
  MatListModule,
  MatStepperModule,
  MatPaginatorModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSidenavModule,
  MatTableModule,
  MatProgressBarModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatNativeDateModule,
  MatRippleModule,
  MatExpansionModule,
  MatSortModule,
  MatMenuModule,
  MatDatepickerModule,
  MatSnackBarModule,
  NgxDropzoneModule
];

import { AlertModalComponent } from './modals/alert-modal/alert-modal.component';
import { AlertModalPocComponent } from './modals/alert-modal-poc/alert-modal-poc.component';
import { CookieModalComponent } from './modals/cookie-modal/cookie-modal.component';
import { ExpireAlertComponent } from './modals/expire-alert/expire-alert.component';
import { HowtoModalComponent } from './modals/howto-modal/howto-modal.component';
import { MembershipModalComponent } from './modals/membership-modal/membership-modal.component';
import { ProfileModalComponent } from './modals/profile-modal/profile-modal.component';
import { LoginModalComponent } from './modals/login-modal/login.component';
import { ProductOnboardingModalComponent } from './modals/product-onboarding-modal/product-onboarding-modal.component';
import { ReviewDialogComponent } from './modals/review-dialog/review-dialog.component';
import { SupplierOnboardingModalComponent } from './modals/supplier-onboarding-modal/supplier-onboarding-modal.component';
import { UploadModalComponent } from './modals/upload-modal/upload-modal.component';
import { UserOnboardingModalComponent } from './modals/user-onboarding-modal/user-onboarding-modal.component';
import { UserTypeModalComponent } from './modals/user-type-modal/user-type-modal.component';
import { DocuSignComponent } from './modals/docu-sign-modal/docu-sign.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';


const dialogs = [
  AlertModalComponent,
  AlertModalPocComponent,
  CookieModalComponent,
  ExpireAlertComponent,
  HowtoModalComponent,
  MembershipModalComponent,
  ProfileModalComponent,
  LoginModalComponent,
  ProductOnboardingModalComponent,
  ReviewDialogComponent,
  SupplierOnboardingModalComponent,
  UploadModalComponent,
  UserOnboardingModalComponent,
  UserTypeModalComponent,
  DocuSignComponent,
  ConfirmationModalComponent,
  WatchlistModalComponent
];

import { UiDrawerComponent } from './ui-drawer/ui-drawer.component';
import { UiPageTitleComponent } from './ui-page-title/ui-page-title.component';
import { UiPageContentComponent } from './ui-page-content/ui-page-content.component';
import { UiDataTableComponent } from './ui-data-table/ui-data-table.component';
import { UiDataFiltersComponent } from './ui-data-filters/ui-data-filters.component';
import { UiSortControlComponent } from './ui-sort-control/ui-sort-control.component';
import { UiPageHeaderComponent } from './ui-page-header/ui-page-header.component';
import { UiPageCloseComponent } from './ui-page-close/ui-page-close.component';
import { SupplierAssesmentTableComponent } from './supplier-assesment-table/supplier-assesment-table.component';
import { ComplianceAssessmentListComponent } from './compliance-assessment-list/compliance-assessment-list.component';
import { ComplianceAssessmentItemComponent } from './compliance-assessment-item/compliance-assessment-item.component';
import { UiMenuComponent } from './ui-menu/ui-menu.component';
import { UiSelectComponent } from './ui-select/ui-select.component';
import { UiImgComponent } from './ui-img/ui-img.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { CountryPickerComponent } from './country-picker/country-picker.component';
import { ReviewLogComponent } from './review-log/review-log.component';
import { ChartDonutComponent } from './chart-donut/chart-donut.component';
import { ChartLineComponent } from './chart-line/chart-line.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { ConnectionsPageComponent } from '../portal/+connections-page/connections-page.component';
import { SupplierMembershipComponent } from '../supplier-membership/supplier-membership.component';

const components = [
  UiDrawerComponent,
  UiPageTitleComponent,
  UiPageContentComponent,
  UiDataTableComponent,
  UiDataFiltersComponent,
  UiSortControlComponent,
  UiPageHeaderComponent,
  UiPageCloseComponent,
  SupplierAssesmentTableComponent,
  ComplianceAssessmentListComponent,
  ComplianceAssessmentItemComponent,
  UiMenuComponent,
  UiSelectComponent,
  UiImgComponent,
  UiTooltipComponent,
  ProductReviewComponent,
  CountryPickerComponent,
  ReviewLogComponent,
  ChartDonutComponent,
  ChartLineComponent,
  ChartLegendComponent,
  ConnectionsPageComponent,
  SupplierMembershipComponent,
  SupplierRapidProductsComponent,
  UiHeaderComponent,
  // Custom Form Elements:
  CustomCheckboxComponent,
  CustomMultiCheckboxComponent,
  RegionMultiCheckboxComponent,
  CustomDatePickerComponent,
  CustomFileDropzoneComponent,
  CustomInputComponent,
  CustomTextAreaComponent,
  CustomSelectorComponent,
  CustomRadioGroupComponent,
  ChartDonutTwinComponent,
  // ProductAssesmentTableComponent
];

import { DragDirective } from '@directives/dragDrop.directive';
import { SingleClickDirective } from '@directives/singleClick.directive';
import { NumberDirective } from '@directives/numbers-only.directive';
import { NiceDirective } from '@directives/nice-only.directive';
import { NoNADirective } from '@directives/no-na.directive';
import { SpecialCharacterDirective } from '@directives/no-special.directive';
import { SpecialCharacterTotalDirective } from '@directives/no-special-total.directive';
import { IsRouteDirective } from '@directives/is-route/is-route.directive';
import { DurationPipe } from '@pipes/duration/duration.pipe';
import { TimeAgoPipe } from '@pipes/time-ago/time-ago.pipe';
import { CapitalizePipe } from '@shared/pipes/capitalize.pipe';

const directives = [
  DragDirective,
  SingleClickDirective,
  NumberDirective,
  NiceDirective,
  NoNADirective,
  SpecialCharacterDirective,
  SpecialCharacterTotalDirective,
  IsRouteDirective,
];

import { SafePipe } from '@pipes/safe/safe.pipe';
import { AnswerIndicatorPipe } from '@pipes/answer-indicator/answer-indicator.pipe';

const pipes = [SafePipe, DurationPipe, AnswerIndicatorPipe, TimeAgoPipe, CapitalizePipe];

import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { SupplierRapidProductsComponent } from '../supplier-rapid-products/supplier-rapid-products.component';
import { UiHeaderComponent } from '@shared/ui-header/ui-header.component';

// Custom Form Component
import { CustomCheckboxComponent } from '@shared/custom-form-elements/custom-checkbox/custom-checkbox.component';
import { CustomMultiCheckboxComponent } from '@shared/custom-form-elements/custom-multi-checkbox/custom-multi-checkbox.component';
import { CustomDatePickerComponent } from '@shared/custom-form-elements/custom-date-picker/custom-date-picker.component';
import { CustomFileDropzoneComponent } from '@shared/custom-form-elements/custom-file-dropzone/custom-file-dropzone.component';
import { CustomInputComponent } from '@shared/custom-form-elements/custom-input/custom-input.component';
import { CustomTextAreaComponent } from '@shared/custom-form-elements/custom-text-area/custom-text-area.component';
import { CustomSelectorComponent } from './custom-form-elements/custom-selector/custom-selector.component';
import { CustomRadioGroupComponent } from './custom-form-elements/custom-radio-group/custom-radio-group.component';
import { ChartDonutTwinComponent } from './chart-donut-twin/chart-donut-twin.component';
import { CustomCalendarHeader } from '@shared/modals/custom-calendar-header/custom-calendar-header.component';
import { RegionMultiCheckboxComponent } from './custom-form-elements/region-multi-checkbox/region-multi-checkbox.component';
import { WatchlistModalComponent } from '@shared/modals/watchlist-modal/watchlist-modal.component';
import { UiTooltipComponent } from '@shared/ui-tooltip/ui-tooltip.component';

const services = [EventEmitterService];

@NgModule({
  imports: [...modules],
  providers: [...services],
  entryComponents: [...dialogs, CustomCalendarHeader],
  exports: [...modules, ...components, ...dialogs, ...directives, ...pipes, CapitalizePipe],
  declarations: [...components, ...dialogs, ...directives, ...pipes, CapitalizePipe, CustomCalendarHeader],
})
export class SharedModule { }
