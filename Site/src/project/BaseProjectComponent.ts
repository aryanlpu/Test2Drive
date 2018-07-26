import { OnInit, OnDestroy } from "@angular/core";
import { HireHistory, HireHistoryRequest } from "./models";
import { ISubscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "environments/environment";
import { JobService } from "./job.service";
import { AuthService } from "auth/auth.service";
import { MutualCancellationDialogService } from "./dialogs/mutual-cancellation/dialog.service";
import { CancelProjectDialogService } from "./dialogs/cancel-project/dialog.service";

export class BaseProjectComponent implements OnInit, OnDestroy {
    public model: HireHistory = new HireHistory();
    public projectTabs: HireHistory = new HireHistory();
    public hasMoreJobs: boolean = false;
    public noRecords: boolean = false;
    private routerSub: ISubscription;
    private routeSub: ISubscription;
    private allJobsSub: ISubscription;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobSvc: JobService,
        private cancelProjectDlg: CancelProjectDialogService
    ) {

    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }

        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }

        if (this.allJobsSub) {
            this.allJobsSub.unsubscribe();
        }
    }

    getImageUrl(imageUrl: string){
        if (imageUrl) {
            return environment.site.imageUrl(imageUrl);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    openCancelPopup(){
        this.cancelProjectDlg.showDialog('freelancer2');
    }

    // openMutualCancelPopup(){
    //     this.mutualCancelDlg.showDialog('freelancer2');
    // }

    protected getJobs(request: HireHistoryRequest) {
        this.allJobsSub = this.jobSvc.getProjects(request).first()
            .subscribe(r => this.onGetSuccessful(r), e => this.onGetError(e));
    }

    protected projectTabsVisiblity() {
        this.allJobsSub = this.jobSvc.getProjectTabs().first()
            .subscribe(r => {
                this.projectTabs = r;
            }, e => this.onGetError(e));
    }

    private onGetSuccessful(res: HireHistory) {
        if (!this.model.items)
            this.model = res;
        else
            this.model.items.push(...res.items);


        this.hasMoreJobs = this.model.items.length < res.count;
        this.noRecords = this.model.items.length == 0;
            console.log( this.model);

    }

    private onGetError(e) {
    }
}