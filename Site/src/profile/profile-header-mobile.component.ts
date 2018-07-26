import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from './models';
import { BaseProfileComponent } from './BaseProfileComponent';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { ConfirmationService } from 'primeng/primeng';
import { AuthService } from 'auth/auth.service';
import { ChatConfig } from 'chat/config';

@Component({
    selector: 'ij-profile-header-mobile',
    templateUrl: './profile-header-mobile.component.html',
    styleUrls: ['./styles/header-mobile.less'],
    providers: [ConfirmationService]
})
export class ProfileHeaderMobileComponent extends BaseProfileComponent {
    constructor (
        route: ActivatedRoute,
        router: Router,
        private contactDlg: ContactProfileDialogService,
        private hireDialog: HireProfileDialogService,
        private referDialog: ReferProfileDialogService,
        private confirmSvc: ConfirmationService,
        private authSvc: AuthService
    ) {
        super(route, router);
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    gotoExternalSite(site) {
        this.confirmSvc.confirm({
            message: `You are about to leave Industry Jump. Are you sure you want to continue? Please take a moment and review the URL below.<br><br><span class="externalurl">${site}</span>`,
            header: "External Web Site",
            rejectVisible: true,
            accept: () => {
                this.openExternalWindow(site);
            }
        });
    }

    onContact() {
        if (this.isLoggedIn) {
            this.contactDlg.showDialog(this.model.profileSysId, ChatConfig.BASE_CONNECTION);
        }
        else {
            this.confirmSvc.confirm({
                message: "Please login to contact this user.",
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onRefer() {
        if (this.isLoggedIn) {
            this.referDialog.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: "Please login to refer this user.",
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onHire() {
        if (this.isLoggedIn) {
            this.hireDialog.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: "Please login to hire this user.",
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }
}