import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { SendPaymentDialogService } from  './dialog.service'
import { ReportProfileDialog } from './models'
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { DialogHeaderService } from 'shared/dialogs/header/dialog-header.service';
import { NotificationsService } from 'angular2-notifications';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { AuthService } from 'auth/auth.service';
import { LateFeePolicyDialogService } from '../late-fee-policy/dialog.service';
@Component({
    selector: 'ij-send-payment-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class SendPaymentDialogComponent  extends BaseDialogComponent<ReportProfileDialog> implements OnDestroy{
    dialogVisible: boolean;
    private dialogSub: ISubscription;
    public profileImage:string;
    private headerSub: ISubscription;
    public title:string;
    public description:string;
    public isPaymentPending:boolean=true;
    public paymentDate:string='06/15/2018';
    public paymentDelivery:string='08/07/2018';
    
    constructor(
        el: ElementRef,
        private dialogSvc: SendPaymentDialogService, 
        notificationSvc: NotificationsService,
        private authSvc: AuthService,
        private headerSvc: DialogHeaderService,
        private lateFeePolicyDialogService:LateFeePolicyDialogService) {
        super(ReportProfileDialog, el, notificationSvc);
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
            this.showDialog();
        });
        // var add =document.getELementByClass("ui-widget-overlay");
       
        this.buildModel();
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    
    showDialog() {
        this.isPaymentPending = true;
        if(this.isPaymentPending)
        {
            this.title='PAYMENT DUE NOW';
            this.description = 'Please execute this payment immediately to ensure an on time payment.';
        }
        else
        {
            this.title='SEND PAYMENT';
            this.description = 'Please execute the transaction:';
        }
        this.dialogVisible = true;

    }

    onReport(){
        this.dialogVisible = false;
    }

    onDeny(){
        this.dialogVisible = false;
    }
    lateFeePolicy()
    {
        this.lateFeePolicyDialogService.showDialog();
    }
 
  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.authSvc.profileSysId).subscribe(header => {
    
      this.model = this.newModel();
       DialogHeader.SetProfileImageUrl(header);
      this.model.header = header;

      this.profileImage=this.model.header.profileImageUrl
 

  
  });
}

}