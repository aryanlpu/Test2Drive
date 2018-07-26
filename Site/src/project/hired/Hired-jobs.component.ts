import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseProjectComponent } from '../BaseProjectComponent';
import { AuthService } from 'auth/auth.service';
import { JobService } from '../job.service';
import { HireHistoryRequest, JobTypes } from '../models';
import { MutualCancellationDialogService } from '../dialogs/mutual-cancellation/dialog.service';
import { CancelProjectDialogService } from '../dialogs/cancel-project/dialog.service';



@Component({
  selector: 'ij-Hired-jobs',
  templateUrl: './Hired-jobs.component.html',
  styleUrls: ['./styles.less']
})
export class HiredJobsComponent extends BaseProjectComponent implements OnInit {
  private pageNo: number = 1;
  constructor(
    route: ActivatedRoute,
    router: Router,
    private routerNav :Router,
    jobSvc: JobService,
    cancelProjectDlg: CancelProjectDialogService
  ) {
    super(route, router, jobSvc, cancelProjectDlg);
  }

  ngOnInit() {
    let request = new HireHistoryRequest();
    request.page = this.pageNo;
    request.jobType = JobTypes.Hired;
    this.getJobs(request);
  }

  getMoreRecords() {
    this.pageNo++;
    let request = new HireHistoryRequest();
    request.page = this.pageNo;
    request.jobType = JobTypes.Accepted;
    this.getJobs(request);
  }
   
  onHire(hireId)
  {
    localStorage.setItem("hireId",hireId.toString()); 
    this.routerNav.navigate(['/hire/All',{'action':'project'}]);
  }
}
