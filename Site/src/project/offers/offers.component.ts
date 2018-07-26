import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseProjectComponent } from '../BaseProjectComponent';
import { AuthService } from 'auth/auth.service';
import { JobService } from '../job.service';
import { HireHistoryRequest, JobTypes } from '../models';
import { HireRequestProfileDialogService } from 'shared/dialogs/hire-request/dialog.service';
import { CancelProjectDialogService } from '../dialogs/cancel-project/dialog.service';


@Component({
    selector: 'ij-offer-jobs',
    templateUrl: './offers.component.html',
    styleUrls: ['./styles.less']
})
export class OffersComponent extends BaseProjectComponent implements OnInit {
    private pageNo: number = 1;
    constructor(
        route: ActivatedRoute,
        router: Router,
        jobSvc: JobService,
        private routerNav:Router,
        private hireDlg: HireRequestProfileDialogService,
        cancelProjectDlg: CancelProjectDialogService
    ) {
        super(route, router, jobSvc, cancelProjectDlg);
    }

    ngOnInit() {
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.Offers;
        this.getJobs(request);
    }

    getMoreRecords() {
        this.pageNo++;
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.Offers;
        this.getJobs(request);
    }

    onHire(hireId)
    {
      localStorage.setItem("hireId",hireId.toString()); 
      this.routerNav.navigate(['/hire/All',{'action':'project'}]);
    }
}