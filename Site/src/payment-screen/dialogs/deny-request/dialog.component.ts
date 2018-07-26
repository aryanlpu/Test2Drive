import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { DenyRequestDialogService } from  './dialog.service'
import { ReportProfileDialog } from './models'
import { NotificationsService } from 'angular2-notifications';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { DialogHeaderService } from 'shared/dialogs/header/dialog-header.service';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { AuthService } from 'auth/auth.service';
@Component({
    selector: 'ij-deny-request-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class DenyRequestDialogComponent  extends BaseDialogComponent<ReportProfileDialog> implements OnDestroy{
    dialogVisible: boolean;
    private dialogSub: ISubscription;
    public profileImage:string;
    private headerSub: ISubscription;
    constructor(
        el: ElementRef,
        private dialogSvc: DenyRequestDialogService, 
        notificationSvc: NotificationsService,
        private authSvc: AuthService,
        private headerSvc: DialogHeaderService) {
        super(ReportProfileDialog, el, notificationSvc);
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
            this.showDialog();
        });
        this.buildModel();
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    
    showDialog() {
        this.dialogVisible = true;
    }

    onReport(){
        this.dialogVisible = false;
    }

    onDeny(){
        this.dialogVisible = false;
    }

    // if (this.h.headerSub) {
    //     this.headerSub.unsubscribe();
    //   }
    
  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.authSvc.profileSysId).subscribe(header => {
    
      this.model = this.newModel();
       DialogHeader.SetProfileImageUrl(header);
       header.hideDetail=true;
      this.model.header = header;

      this.profileImage=this.model.header.profileImageUrl
 

  
  });
}

}