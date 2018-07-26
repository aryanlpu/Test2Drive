import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseProjectComponent } from '../BaseProjectComponent';
import { AuthService } from 'auth/auth.service';
import { JobService } from '../job.service';
import { HireHistoryRequest, JobTypes, HireStatusTypes } from '../models';
import { HireRequestProfileDialogService } from 'shared/dialogs/hire-request/dialog.service';
import { MutualCancellationDialogService } from '../dialogs/mutual-cancellation/dialog.service';
import { CancelProjectDialogService } from '../dialogs/cancel-project/dialog.service';


@Component({
    selector: 'ij-all-jobs',
    templateUrl: './all-jobs.component.html',
    styleUrls: ['./styles.less']
})
export class AllJobsComponent extends BaseProjectComponent implements OnInit {
    private pageNo: number = 1;
    private  loginProfileSysId:string;
    public hireStatusTypes = HireStatusTypes;
    constructor(
        jobSvc: JobService,
        route: ActivatedRoute,
        router: Router,
        private auth:AuthService,
        private routerNav:Router,
        private hireDlg: HireRequestProfileDialogService,
        private mutualCancelDlg: MutualCancellationDialogService,
        cancelProjectDlg: CancelProjectDialogService
    ) {
        super(route, router, jobSvc,cancelProjectDlg);
    }

    ngOnInit() {
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.All;
        this.getJobs(request);
      this.loginProfileSysId = this.auth.profileSysId;
      
        // this.mutualCancelDlg.showDialog(1);
    }


    get profileSysId() {
        return this.auth.profileSysId;
    }
    getMoreRecords() {
        this.pageNo++;
        let request = new HireHistoryRequest();
        request.page = this.pageNo;
        request.jobType = JobTypes.All;
      this.getJobs(request);

    }

    onHire(hireId: string,status:string) {
        debugger;
        // this.hireDlg.showDialog(hireId);
        if(status=='hired')
        {
            localStorage.setItem("hireId",hireId.toString()); 
            this.routerNav.navigate(['/hire/payment-status',{'action':'project'}]);
        }
        else
        {
            localStorage.setItem("hireId",hireId.toString()); 
            this.routerNav.navigate(['/hire/All',{'action':'project'}]);
     
        }
       }
}
