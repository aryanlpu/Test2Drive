import { Component, OnInit } from '@angular/core';
import { ProjectDialogService } from 'shared/dialogs/project/dialog.service';
import { BaseProfileComponent } from '../profile/BaseProfileComponent';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { JobService } from './job.service';
import { BaseProjectComponent } from './BaseProjectComponent';
import { CancelProjectDialogService } from './dialogs/cancel-project/dialog.service';
@Component({
  selector: 'ij-project',
  templateUrl: './project.component.html',
  styleUrls: ['./styles.less']
})
export class ProjectComponent extends BaseProjectComponent implements OnInit {

  constructor(
    route: ActivatedRoute,
    router: Router,
    jobSvc: JobService,
    cancelProjectDlg: CancelProjectDialogService,
    private dialogSvc: ProjectDialogService,
    private auth: AuthService,
  ) {
    super(route, router, jobSvc, cancelProjectDlg);
  }

  ngOnInit() {
    this.projectTabsVisiblity();
  }

  onNewProject() {
    this.dialogSvc.newProject(this.auth.profileSysId);
  }



}
