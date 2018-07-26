import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { MutualCancellationDialogService } from './dialog.service';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { MutualCancellationDialog } from './models'
import { AuthService } from 'auth/auth.service'

import 'rxjs/add/operator/first';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { DialogHeaderService } from 'shared/dialogs/header/dialog-header.service';
import { JobService } from 'project/job.service';
import { CancelOptionTypes } from 'project/models';

@Component({
    selector: 'ij-mutual-cancellation-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})
export class MutualCancellationDialogComponent extends BaseDialogComponent<MutualCancellationDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    public cancelOptions: any[] = [];

    constructor(
        el: ElementRef,
        private dialogSvc: MutualCancellationDialogService,
        private authSvc: AuthService,
        private headerSvc: DialogHeaderService,
        private jobSvc: JobService
    ) {
        super(MutualCancellationDialog, el, null);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(hireId => {
            this.resetForm();
            this.model.hireId = hireId;
            this.buildModel();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.headerSub) {
            this.headerSub.unsubscribe();
        }
    }

    mutualCancel(form: NgForm){
        if (!form.valid) return;
        this.model.isMutual = true;
        this.jobSvc.mutualCancel(this.model).first().subscribe(r=>{
            
        }, e => this.onLoadError())
    }

    protected onSend(form: NgForm) {
        if (!form.valid) return;

        this.authSvc.forgotPassword(this.model.email).first().subscribe(x => {
            this.submitted = true;
        });
    }

    private buildModel() {
        this.headerSub = this.jobSvc.getProfileCard(this.model.hireId).subscribe(header => {
            DialogHeader.SetProfileImageUrl(header);
            this.model.header = header;
            this.model.header.hideDetail = true;
            this.getCancelOptions();
            this.showDialog();
        }, e => this.onLoadError());
    }

    private getCancelOptions(){
        this.jobSvc.getCancelOptions(CancelOptionTypes.Mutual).subscribe(r => {
            this.cancelOptions = r;
            this.model.cancelOption = this.cancelOptions[0].id;
        })
    }
}