import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SafePipe } from './pipes/safe.pipe'

// components
import { RatingComponent } from './components/rating/rating.component';
import { FocusDirective } from './directives/focus.directive';
import { RotatingPlaceholderDirective } from './directives/rotating-placeholder.directive';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { SiteSubHeaderComponent } from './components/site-subheader/site-subheader.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SeeMoreComponent } from './components/see-more/see-more.component';
import { AvatarMenuComponent } from './components/avatar-menu/avatar-menu.component';
import { DialogHeaderComponent } from './dialogs/header/dialog-header.component';
import { IndustryScoreComponent } from './components/industry-score/industry-score.component';
import { SaveIndicator } from './components/save-indicator/save-indicator.component';
import { SearchCardComponent } from './components/search-card/search-card.component';
import { QuickSearchComponent } from './components/quick-search/quick-search.component';
import { MemberSelectorComponent } from './components/quick-search/member-selector.component';
import { ProjectSelectorComponent } from './components/quick-search/project-selector.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { SearchMenuComponent } from './components/search-menu/search-menu.component';
import { AdditionaKitComponent } from './components/additional-kit/additiona-kit.component';
import { AdditionaKitShowComponent } from './components/additional-kitShow/additiona-kitShow.component';
import { HireRequestComponent } from './components/Hire-Request/hire-request.component';
import { PaymentSettingsComponent } from './components/payment-settings/payment-settings.component';
import { HireAddExpanseComponent } from './components/add-expanse/hire-addExpanseRequest.component'
import { HireAddExpanseRequestComponent } from './components/add-expanseRequest/hire-addExpanseRequestforApproval.component'
// services
import { AppInsightsService } from './services/app-insights.service';
import { BetaTestService } from './services/beta-test.service';
import { DialogHeaderService } from './dialogs/header/dialog-header.service';
import { QuickSearchService } from './components/quick-search/quick-search.service';
import { ProgressColorService } from './services/progress-color.service';
import { ProfileNotificationService } from 'chat/services/profile-notfication.service';
import { IntercomProxyService } from './services/intercom-proxy.service';
import { HireAddExpenseService } from './components/add-expanse/hire-addExpanseRequest.service'
import { HireAddExpenseRequestService} from './components/add-expanseRequest/hire-addExpanseRequestforApproval.service'
// validation
import { ReleaseYearValidatorDirective } from './directives/release-year.directive';
import { InputValidationDirective } from './directives/input-validation.directive';
import { FormValidationDirective } from './directives/form-validation.directive';
import { VideoUrlValidatorDirective } from './directives/video-url.directive';
import { MultiEmailValidatorDirective } from './directives/multi-email.directive';
import { AddressValidatorDirective } from './directives/address-validator.directive';

// dialogs
import { ReviewProfileDialogComponent } from './dialogs/review/dialog.component';
import { ReviewProfileDialogService } from './dialogs/review/dialog.service';

import { ContactProfileDialogComponent } from './dialogs/contact/dialog.component';
import { ContactProfileDialogService } from './dialogs/contact/dialog.service';

import { HireRequestProfileDialogComponent } from './dialogs/hire-request/dialog.component';

import { HireProfileDialogComponent } from './dialogs/hire/dialog.component';
import { HireProfileDialogService } from './dialogs/hire/dialog.service';

import { HireRequestProfileDialogService } from './dialogs/hire-request/dialog.service';

import { ReferProfileDialogComponent } from './dialogs/refer/dialog.component';
import { ReferProfileDialogService } from './dialogs/refer/dialog.service';

import { ProjectDialogComponent } from './dialogs/project/dialog.component';
import { ProjectDialogService } from './dialogs/project/dialog.service';

import { ContestReviewDialogComponent } from './dialogs/contest-review/dialog.component';
import { ContestReviewDialogService } from './dialogs/contest-review/dialog.service';

import { ProfilePicDialog } from './dialogs/profile-pic/dialog.component';
import { ProfilePicDialogService } from './dialogs/profile-pic/dialog.service';

import { VerifyFacebookDialogComponent } from './dialogs/verify-facebook/dialog.component';
import { VerifyFacebookDialogService } from './dialogs/verify-facebook/dialog.service';

import { ExternalUrlDialogComponent } from './dialogs/external-url/dialog.component';
import { ExternalUrlDialogService } from './dialogs/external-url/dialog.service';

import { ReviewRequestDialogComponent } from './dialogs/review-request/dialog.component';
import { ReviewRequestDialogService } from './dialogs/review-request/dialog.service';
import { ContactFacebookDialogComponent } from './dialogs/contact-facebook/dialog.component';
import { ContactFacebookDialogService } from './dialogs/contact-facebook/dialog.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ViewPdfComponent } from './dialogs/view-pdf/dialog.component';
import { ViewPdfDialogService } from './dialogs/view-pdf/dialog.service';
import { PasswordDialogComponent } from './dialogs/password-dialog/dialog.component';
import { PasswordDialogService } from './dialogs/password-dialog/dialog.service';
// 3rd party

// 3rd party
import { DpDatePickerModule } from 'ng2-date-picker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { DialogModule, RatingModule, AutoCompleteModule, CalendarModule, ConfirmDialogModule, FileUploadModule } from 'primeng/primeng';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-img-cropper';
import { Ng2OdometerModule } from 'ng2-odometer';
import { MomentModule } from 'angular2-moment';
import { DuplicateReviewComponent } from 'shared/dialogs/verify-facebook/duplicate-review/dialog.component';
import { SiteMenuComponent } from 'shared/components/site-menu/site-menu.component';
import { ErrorDialogComponent } from 'shared/dialogs/error-dialog/dialog.component';
import { CharacterCounterComponent } from 'shared/components/character-counter/character-counter.component';
import { ReviewLoginComponent } from 'shared/dialogs/verify-facebook/login-dialog/dialog.component';
import {BudgetLevelDialogComponent} from './dialogs/budget-level/dialog.component';
import {BudgetLevelDialogService} from './dialogs/budget-level/dialog.service';
import { ConfirmationDialogComponent } from 'shared/dialogs/confirmation-dialog/dialog.component';
import { ConfirmationDialogService } from 'shared/dialogs/confirmation-dialog/dialog.service';
import { ErrorDialogService } from 'shared/dialogs/error-dialog/dialog.service';
import { SiteNavigationComponent } from 'shared/components/site-navigation/site-navigation.component';
import { SignalRConnectionService } from 'chat/services/signalR.connection.service';
import { SignalRConService } from 'chat/services/signalR.service';
import { ChatDialogComponent } from 'chat/components/dialog.component';
import { AccountService } from 'shared/components/payment-settings/account.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        DpDatePickerModule,
        NguiAutoCompleteModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        TextMaskModule,
        DialogModule,
        RatingModule,
        CalendarModule,
        ImageCropperModule,
        MomentModule,
        InfiniteScrollModule,
        FileUploadModule,
        Ng2OdometerModule.forRoot()
    ],
    declarations: [
        FocusDirective,
        SafePipe,
        SiteFooterComponent,
        RatingComponent,
        RotatingPlaceholderDirective,
        IndustryScoreComponent,
        ProfileMenuComponent,
        SearchMenuComponent, 
        ReviewProfileDialogComponent,
        ContactProfileDialogComponent,
        HireProfileDialogComponent,
        HireRequestProfileDialogComponent,
        ReferProfileDialogComponent,
        ProjectDialogComponent,
        SiteHeaderComponent,
        SiteSubHeaderComponent,
        SeeMoreComponent,
        AvatarMenuComponent,
        DialogHeaderComponent,
        VideoUrlValidatorDirective,
        ReleaseYearValidatorDirective,
        InputValidationDirective,
        FormValidationDirective,
        SaveIndicator,
        SearchCardComponent,
        QuickSearchComponent,
        ContestReviewDialogComponent,
        MemberSelectorComponent,
        MultiEmailValidatorDirective,
        ProfilePicDialog,
        AddressValidatorDirective,
        ExternalUrlDialogComponent,
        ReviewRequestDialogComponent,
        VerifyFacebookDialogComponent,
        ProjectSelectorComponent,
        DuplicateReviewComponent, 
        ContactFacebookDialogComponent,
        SiteMenuComponent,
        ErrorDialogComponent,
        CharacterCounterComponent,
        ConfirmationDialogComponent,
        ReviewLoginComponent,
        BudgetLevelDialogComponent,
        SiteNavigationComponent,
        AdditionaKitComponent,
        AdditionaKitShowComponent,
        HireRequestComponent,
        ViewPdfComponent,
        PaymentSettingsComponent,
        PasswordDialogComponent,
        HireAddExpanseComponent,
        HireAddExpanseRequestComponent
    ],
    exports: [
        RatingComponent,
        SeeMoreComponent,
        SafePipe,
        FocusDirective,
        RotatingPlaceholderDirective,
        ReviewProfileDialogComponent,
        ContactProfileDialogComponent,
        HireProfileDialogComponent,
        HireRequestProfileDialogComponent,
        ReferProfileDialogComponent,
        ProjectDialogComponent,
        IndustryScoreComponent,        
        SiteHeaderComponent,
        SiteSubHeaderComponent,
        SiteFooterComponent,
        DialogHeaderComponent,
        VideoUrlValidatorDirective,
        ReleaseYearValidatorDirective,
        InputValidationDirective,
        FormValidationDirective,
        SaveIndicator,
        SearchCardComponent,
        ContestReviewDialogComponent,
        MultiEmailValidatorDirective,
        ProfilePicDialog,
        AddressValidatorDirective,
        ExternalUrlDialogComponent,
        ReviewRequestDialogComponent,
        VerifyFacebookDialogComponent,
        ContactFacebookDialogComponent,
        SiteMenuComponent,
        CharacterCounterComponent,
        ConfirmationDialogComponent,
        ErrorDialogComponent,
        BudgetLevelDialogComponent,
        SiteNavigationComponent,
        AdditionaKitComponent,
        AdditionaKitShowComponent,
        HireRequestComponent,
        ViewPdfComponent,
        PaymentSettingsComponent,
        PasswordDialogComponent,
        HireAddExpanseComponent,
        HireAddExpanseRequestComponent
    ],
    providers: [
        AppInsightsService,
        BetaTestService,
        ReviewProfileDialogService,
        ContactProfileDialogService,
        HireProfileDialogService,
        HireRequestProfileDialogService,
        ReferProfileDialogService,
        ProjectDialogService,
        DialogHeaderService,
        QuickSearchService,
        ContestReviewDialogService,
        ProfilePicDialogService,
        ExternalUrlDialogService,
        ReviewRequestDialogService,
        ErrorDialogService,
        VerifyFacebookDialogService,
        ContactFacebookDialogService,
        ProfileNotificationService,
        IntercomProxyService,
        BudgetLevelDialogService,
        ConfirmationDialogService,
        SignalRConnectionService,
        ViewPdfDialogService,
        PasswordDialogService,
        AccountService,
        HireAddExpenseService,
        HireAddExpenseRequestService
        // SignalRConService
    ]
})
export class SharedModule {}
