import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseStepComponent, ProfileCompanyStep } from './models';
import { ProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/profile-pic/dialog.service';
import { masks } from '../../shared/view/masks';
import { patterns } from '../../shared/view/regex-patterns';
import { LookupService } from 'shared/services/lookup.service';

@Component({
    selector: "ij-su-profile-company-step",
    templateUrl: "profile-company-step.component.html",
    styleUrls: [
        "../../shared/styles/account/common.less",
        "../../shared/styles/account/forms.less",
    ]
})
export class ProfileCompanyStepComponent extends BaseStepComponent {
    passwordRegex = patterns.password;
    phoneMask = masks.phone;
    phoneRegex = patterns.phone;
    urlRegex = patterns.url;
    nameRegex = patterns.name;
    zipcodeMask = masks.zipCode;
    zipcodeRegex = patterns.zipCode;
    states = [];
    @Input() model: ProfileCompanyStep;

    constructor(
        router: Router,
        private lookup: LookupService,
        private picDlg: ProfilePicDialogService
    ) {
        super(router);
        this.states = this.lookup.getStates();
    }

    onProfilePicClicked(event) {
        event.preventDefault();
        this.picDlg.showDialog(ProfilePicDialogMode.Signup);
    }

    onProfilePicSaved(event) {
        this.model.companyPic = event;
    }

    onNextStep(form: any) {
        if (!this.validate(form) || !this.model.companyPic) {
            return;
        }

        this.nextStep();
    }
}