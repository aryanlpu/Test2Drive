import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseProjectComponent } from '../BaseProjectComponent';
import { AuthService } from 'auth/auth.service';
import { JobService } from '../job.service';
import { HireHistoryRequest, JobTypes } from '../models';
import { CancelProjectDialogService } from '../dialogs/cancel-project/dialog.service';


@Component({
    selector: 'ij-previous-jobs',
    templateUrl: './previous-jobs.component.html',
    styleUrls: ['./styles.less']
})
export class PreviousJobsComponent extends BaseProjectComponent implements OnInit {
    private pageNo: number = 1;
    constructor(
        route: ActivatedRoute,
        router: Router,
        jobSvc: JobService,
        cancelProjectDlg: CancelProjectDialogService
    ) {
        super(route, router, jobSvc, cancelProjectDlg);
    }

    ngOnInit() {
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.Previous;
        this.getJobs(request);
    }

    getMoreRecords() {
        this.pageNo++;
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.Previous;
        this.getJobs(request);
    }
}