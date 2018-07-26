
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { ReportDialogService } from  '../dialogs/report-problem/dialog.service' 
import { CancelationPolicyDialogService } from '../dialogs/cancelation-policy/dialog.service'
import { HireProfileRequestDisplay,UserProfileModel } from '../models'
import { PaymentScreenService } from './../payment.Screen.service'
import { environment } from 'environments/environment';
import { SendPaymentDialogService } from '../dialogs/send-payment/dialog.service';
import { MutualCancellationDialogService } from '../dialogs/mutual-cancellation/dialog.service'
@Component({
    selector: 'ij-payment-status',
    templateUrl: './payment.status.component.html',
    styleUrls: ['./styles.less']
})
export class PaymentStatusComponent  implements OnInit {
    modelData:HireProfileRequestDisplay;
    private model:UserProfileModel;
    constructor(
        private router:Router,
        private paymentScreenService:PaymentScreenService,
        private reportDialogService:ReportDialogService,
        private cancelationPolicyDialogService:CancelationPolicyDialogService,
        private sendPaymentDialogService:SendPaymentDialogService,
        private mutualCancellation:MutualCancellationDialogService
    ) {
       
    }

    ngOnInit() {
        setTimeout(()=>{
            let hireId:number
            hireId =  Number(localStorage.getItem("hireId"));     
            this.getHireDetail(hireId);
        },300);
    }

    onReportProblem()
    {
        this.reportDialogService.showDialog();
    }
    addExpense()
    {
       this.router.navigate(['/hire/All',{'action':'project', addExpense:true}])
    }
    onCancelation()
    {
        this.cancelationPolicyDialogService.showDialog();
    }
    onSend()
    {
        this.sendPaymentDialogService.showDialog();
    }

    getHireDetail(id)
    {
        this.paymentScreenService.getHireDetails(id).subscribe(responsedata => {
           this.modelData = responsedata[0];
       });
    }
    getImageUrl(imageUrl: string){
          
        if (imageUrl) {
            return environment.site.imageUrl(imageUrl);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    onCancelDialog()
    {
        this.mutualCancellation.showDialog(this.modelData.id);
    }

   
}
