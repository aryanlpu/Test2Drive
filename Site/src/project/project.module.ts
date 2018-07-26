import { NgModule } from "@angular/core";
import { ProjectComponent } from "./project.component";
import { ProjectRoutingModule } from "./project.routing.module";
import { ProjectHeaderComponent } from "./project.header.component";
import { AllJobsComponent } from "./all-jobs/all-jobs.component";
import { SharedModule } from "shared/shared.module";
import { OffersComponent } from "./offers/offers.component";
import { ProfileService } from "profile/profile.service";
import { JobService } from "./job.service";
import { AcceptedJobsComponent } from "./accepted-jobs/accepted-jobs.component";
import { PreviousJobsComponent } from "./previous-jobs/previous-jobs.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CancelledJobsComponent } from "./cancelled-jobs/cancelled-jobs.component";
import { MutualCancellationDialogComponent } from "./dialogs/mutual-cancellation/dialog.component";
import { MutualCancellationDialogService } from "./dialogs/mutual-cancellation/dialog.service";
import { ForgotPasswordDialogService } from "login/forgot-password/dialog.service";

import { CheckboxModule, RadioButtonModule, DialogModule } from 'primeng/primeng';
import { CustomFormsModule } from "ng2-validation";

import { DialogHeaderService } from "shared/dialogs/header/dialog-header.service";
import { CancelProjectDialogService } from "./dialogs/cancel-project/dialog.service";
import { CancellationRequestComponent } from "./dialogs/cancel-project/dialog.component";
import { HiredJobsComponent } from "project/Hired/Hired-jobs.component";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CustomFormsModule,
        SharedModule,
        ProjectRoutingModule,
        DialogModule,
        CheckboxModule,
        RadioButtonModule
    ],
    declarations: [
        ProjectComponent,
        ProjectHeaderComponent,
        AllJobsComponent,
        OffersComponent,
        AcceptedJobsComponent,
        PreviousJobsComponent,
        CancelledJobsComponent,
        MutualCancellationDialogComponent,
        CancellationRequestComponent,
        HiredJobsComponent
    ],
    exports: [
        ProjectComponent
    ],
    providers: [
        ProfileService,
        JobService,
        DialogHeaderService,
        ForgotPasswordDialogService,
        MutualCancellationDialogService,
        CancelProjectDialogService
    ]
})
export class ProjectModule { }
