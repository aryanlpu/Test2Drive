import { NgModule } from "@angular/core";
import { PaymentScreenComponent } from "./payment.screen.component";
import { PaymentScreenRoutingModule } from "./payment.screen.routing.module";
import { PaymentScreenHeaderComponent } from "./payment.screen.header.component";
import { HireComponent  } from "./hire/hire.component";
import { PaymentStatusComponent } from "./payment-status/payment.status.component";
import { SharedModule } from "shared/shared.module";
import { LookupService } from 'shared/services/lookup.service';
import { PaymentScreenService } from "./payment.Screen.service"
import { JobService } from '../project/job.service';
import { ProjectDialogService } from 'shared/dialogs/project/dialog.service';
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivatePolicyDialogService } from '../signup/private-policy-dialog/dialog.service';
import {    DialogModule,
            RatingModule,
            AutoCompleteModule,
            CalendarModule,
            DataTableModule,
            CheckboxModule,
            RadioButtonModule,
            LightboxModule } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { HireContractorComponent } from '../payment-screen/hire-contractor/hire-contractor.component';
import { HireEmployeerComponent } from '../payment-screen/hire-employeer/hire-employeer.component';
import { AdditionaKitComponent } from '../shared/components/additional-kit/additiona-kit.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


//dialogs

import { CancelationPolicyDialogComponent } from './dialogs/cancelation-policy/dialog.component';
import { CancelationPolicyDialogService }   from './dialogs/cancelation-policy/dialog.service';

import { DenyRequestDialogComponent } from './dialogs/deny-request/dialog.component';
import { DenyRequestDialogService } from './dialogs/deny-request/dialog.service';



import { HirePolicyDialogComponent } from './dialogs/hire-policy/dialog.component';
import { HirePolicyDialogService }   from './dialogs/hire-policy/dialog.service';

import { LateFeePolicyDialogComponent } from './dialogs/late-fee-policy/dialog.component';
import { LateFeePolicyDialogService }   from './dialogs/late-fee-policy/dialog.service';

import { ReportDialogComponent }    from './dialogs/report-problem/dialog.component';
import { ReportDialogService }    from './dialogs/report-problem/dialog.service';

import { SendPaymentDialogComponent } from './dialogs/send-payment/dialog.component';
import { SendPaymentDialogService }  from './dialogs/send-payment/dialog.service';
import { CancellationRequestComponent } from "./dialogs/cancel-project/dialog.component";
import { CancelProjectDialogService } from "./dialogs/cancel-project/dialog.service";

import { MutualCancellationDialogComponent } from "./dialogs/mutual-cancellation/dialog.component";
import { MutualCancellationDialogService } from "./dialogs/mutual-cancellation/dialog.service";

@NgModule({
    imports: [
        [CommonModule],
        FormsModule,
        PaymentScreenRoutingModule,
        CalendarModule,
        AutoCompleteModule,
        SharedModule,
        DataTableModule,
        DialogModule,
        CheckboxModule,
        RadioButtonModule,
        LightboxModule,
        PdfViewerModule
   
    ],
    declarations: [
        PaymentScreenComponent,
        PaymentScreenHeaderComponent,
        HireComponent,
        PaymentStatusComponent,
        HireContractorComponent,
        HireEmployeerComponent,
        CancelationPolicyDialogComponent,
        DenyRequestDialogComponent,
        HirePolicyDialogComponent,
        LateFeePolicyDialogComponent,
        ReportDialogComponent,
        SendPaymentDialogComponent,
        CancellationRequestComponent,
        MutualCancellationDialogComponent
       ],
    exports: [
        PaymentScreenComponent,
        HireContractorComponent,
        HireEmployeerComponent,
        CancelationPolicyDialogComponent,
        DenyRequestDialogComponent,
        HirePolicyDialogComponent,
        LateFeePolicyDialogComponent,
        ReportDialogComponent,
        SendPaymentDialogComponent,
        CancellationRequestComponent,
        MutualCancellationDialogComponent
      ],
    providers: [
        PaymentScreenService,
        LookupService,
        PrivatePolicyDialogService,
        DatePipe,
        JobService,
        CancelProjectDialogService,
        ProjectDialogService,
        CancelationPolicyDialogService,
        DenyRequestDialogService,
        HirePolicyDialogService,
        LateFeePolicyDialogService,
        ReportDialogService,
        SendPaymentDialogService,
        CancelProjectDialogService,
        MutualCancellationDialogService
    ],
    entryComponents:[AdditionaKitComponent]
})
export class PaymentScreenModule { }
