import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { BaseStepComponent, ProfileStep } from './models';
import { IValidCityRequest } from 'shared/services/address.service';
import { LookupService } from 'shared/services/lookup.service';
import { ProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/profile-pic/dialog.service';
import { masks } from 'shared/view/masks';
import { patterns } from 'shared/view/regex-patterns';
import { constants } from 'environments/constants';
import { CrewRole } from 'shared/services/CrewRole';
import { AddressService } from 'shared/services/address.service';
import { Genders } from 'shared/services/Genders';

@Component({
    selector: 'ij-profile-step',
    templateUrl: 'profile-step.component.html',
    styleUrls: [
        '../../shared/styles/account/common.less',
        '../../shared/styles/account/forms.less'
    ],
    providers: [ProfilePicDialogService, AddressService]
})
export class ProfileStepComponent extends BaseStepComponent implements OnInit, OnDestroy {
    public nameRegex = patterns.name;
    public zipcodeMask = masks.zipCode;
    public zipcodeRegex = patterns.zipCode;
    public passwordRegex = patterns.password;

    public roleSuggestions: string[];
    public allRoles: CrewRole[] = [];
    public states = [];
    public genders = [];

    @Input() model: ProfileStep;

    private roleSub: ISubscription;

    constructor
        (
        router: Router,
        private lookup: LookupService,
        private picDlg: ProfilePicDialogService,
        private addressSvc: AddressService
        ) {
        super(router);
        this.states = lookup.getStates();
    }

    ngOnInit() {
        this.setGenders();
        this.roleSub = this.lookup.getCrewRoles().subscribe(roles => {
            this.allRoles = roles;
        });
    }

    ngOnDestroy() {
        if (this.roleSub) {
            this.roleSub.unsubscribe();
        }
    }

    onNext(form: any) {
        if (!this.validate(form) || !this.model.profilePic) {
            return;
        }

        this.next();
    }

    onProfilePicClicked(event) {
        event.preventDefault();
        this.picDlg.showDialog(ProfilePicDialogMode.Signup);
    }

    onProfilePicSaved(event) {
        this.model.profilePic = event;
    }

    onRolesKeyDown(event) {
        if (this.model.roles && this.model.roles.length >= constants.roles.maxRoles) return [];

        var query = (event.query || "").toLocaleLowerCase();

        this.roleSuggestions = this.allRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    private setGenders() {
        this.genders.push({ name: 'Gender *', value: '' });

        for (let g of this.lookup.getGenderKeys()) {
            this.genders.push({ name: Genders[g], value: g });
        }
    }
}