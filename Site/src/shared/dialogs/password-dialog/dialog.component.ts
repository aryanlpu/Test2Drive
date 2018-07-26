import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { environment } from 'environments/environment';
import { PassowrdDialog } from './models';
import { PasswordDialogService } from './dialog.service';
import { Credentials } from 'login/credentials';
import { AuthService, AuthResult } from 'auth/auth.service';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';

@Component({
    selector: 'ij-password-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})
export class PasswordDialogComponent extends BaseDialogComponent<PassowrdDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    credentials: Credentials = new Credentials();
    error: string;
    success: string;
    submitted: boolean;
    constructor(el: ElementRef,
         private dialogSvc: PasswordDialogService,
         private authService: AuthService,
         private intercomSvc: IntercomProxyService,) {
        super(PassowrdDialog, el, null);
        
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(password => {
        this.credentials.email = localStorage.getItem('username');
            this.showDialog();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    login(valid: boolean) {
        if (!valid) return;
        this.submitted = true;
    
        this.authService
          .login(this.credentials.email, this.credentials.password)
          .first()
          .subscribe(r => this.onLogin(r));
      }

      private onLogin(result: AuthResult): void {
        this.submitted = false;
    
        if (result == AuthResult.Success) {
          this.error = null;
          this.intercomSvc.boot(this.authService.fullName, this.credentials.email);  
          this.dialogSvc.isActivePayment(true);
          this.hideDialog();  
        }
        else if (result == AuthResult.ServerOffline) {
          this.error = "The server is offline. Please try again later.";
        }
        else if (result == AuthResult.InvalidCredentials) {
          this.error = "Password is incorrect.";
        }
      }
    onCancel() {
        this.dialogSvc.isActivePayment(false);
        this.hideDialog();
    }

}