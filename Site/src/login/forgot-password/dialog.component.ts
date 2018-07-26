import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { ForgotPasswordDialogService } from './dialog.service';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { ForgotPasswordDialog } from './models'
import { AuthService } from 'auth/auth.service'

import 'rxjs/add/operator/first';

@Component({
    selector: 'ij-forgot-password-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})
export class ForgotPasswordDialogComponent extends BaseDialogComponent<ForgotPasswordDialog> implements OnDestroy {
    private dialogSub: ISubscription;

    constructor (
        el: ElementRef,
        private dialogSvc: ForgotPasswordDialogService,
        private authSvc: AuthService
    ) {
        super(ForgotPasswordDialog, el, null);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
            this.buildModel();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }

    protected onSend(form: NgForm) {
        if (!form.valid) return;

        this.authSvc.forgotPassword(this.model.email).first().subscribe(x => {
            this.submitted = true;
        });
    }

    private buildModel() {
        this.model = this.newModel();
        this.submitted = false;
        this.showDialog();
    }
}