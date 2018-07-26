import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { LateFeePolicyDialogService } from  './dialog.service'

@Component({
    selector: 'ij-late-fee-policy-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class LateFeePolicyDialogComponent implements OnDestroy{
    dialogVisible: boolean;
    private dialogSub: ISubscription;
    constructor(private dialogSvc: LateFeePolicyDialogService) {
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
            this.showDialog();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    
    showDialog() {
        this.dialogVisible = true;
    }  
    onAccept(){
        this.dialogSvc.acceptTerm(true);
        this.dialogVisible = false;

    }

    onDeny(){
        this.dialogSvc.acceptTerm(false);
        this.dialogVisible = false;
    }
}