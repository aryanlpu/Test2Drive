import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from './models';
import { BaseProfileComponent } from './BaseProfileComponent';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { ConfirmationService } from 'primeng/primeng';
import { ExternalUrlDialogService } from 'shared/dialogs/external-url/dialog.service';
import { AuthService } from 'auth/auth.service';
import { ChatConfig } from 'chat/config';

@Component({
    selector: 'ij-profile-header-desktop',
    templateUrl: 'profile-header-desktop.component.html',
    styleUrls: ['./styles/header-desktop.less'],
    providers: [ConfirmationService]
})
export class ProfileHeaderDesktopComponent extends BaseProfileComponent {
    private externalWebsite: string;

    constructor (
        route: ActivatedRoute,
        router: Router,
        private navRouter:Router,
        private contactDlg: ContactProfileDialogService,
        private hireDlg: HireProfileDialogService,
        private referDlg: ReferProfileDialogService,
        private confirmSvc: ConfirmationService,
        private externalUrlDialog: ExternalUrlDialogService,
        private authSvc: AuthService
    ) {
        super(route, router);
    }

    get reviewLabel() {
        if (this.model.reviews != null && this.model.reviews.cards.length == 1) {
            return "Review";
        }

        return "Reviews";
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }
    
    gotoExternalSite(site) {
        this.externalUrlDialog.showDialog(site);
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
            this.referDlg.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: "Please login to refer this user.",
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    HireRequest() {
        if (this.isLoggedIn) {
            localStorage.setItem("hireId", null); 
            this.navRouter.navigate(['/hire/All',{'action':'hire-request','id':this.model.profileSysId}]);
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