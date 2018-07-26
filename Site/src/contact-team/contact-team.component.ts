import { NgForm } from '@angular/forms';
import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContactTeamService } from './contact-team.service';
import { ContactTeamRequest } from './models';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';

@Component({
    selector: 'ij-contactus',
    templateUrl: 'contact-team.component.html',
    styleUrls: ['styles.less'],
    providers: [ContactTeamService]
})
export class ContactTeamComponent implements OnDestroy {
    public model: ContactTeamRequest;
    public showSaveCompleted: boolean = false;
    public showSaveErrored: boolean = false;

    private form: NgForm;
    private contactSub: ISubscription;
    
    constructor (
        private contactSvc: ContactTeamService
    ) {
        this.buildModel();
    }

    ngOnDestroy() {
        if (this.contactSub) {
            this.contactSub.unsubscribe();
        }
    }

    onSubmit(form: NgForm) {
        this.form = form;
        this.showSaveCompleted = false;
        this.showSaveErrored = false;

        if (!form.valid) return;        

        this.contactSub = this.contactSvc
            .sendMessage(this.model)
            .subscribe
            (
                r => this.onSaveSuccess(),
                e => this.onSaveError(e),
            );
    }

    private buildModel() {
        this.model = new ContactTeamRequest();
    }

    private onSaveSuccess() {
        this.form.reset();
        this.showSaveCompleted = true;
        this.showSaveErrored = false;
        this.buildModel();
    }
  
    private onSaveError(e: ISiteApiResponse) {
        this.showSaveCompleted = false;
        this.showSaveErrored = true;
    }
}

