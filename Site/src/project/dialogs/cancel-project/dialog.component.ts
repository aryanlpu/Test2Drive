import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { CancelProjectDialogService } from './dialog.service';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { CancelProjectDialog } from './models'
import { AuthService } from 'auth/auth.service'
import 'rxjs/add/operator/first';
import { DialogHeaderService } from 'shared/dialogs/header/dialog-header.service';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';

@Component({
  selector: 'ij-request-cancellation-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./styles.less']
})
export class CancellationRequestComponent extends BaseDialogComponent<CancelProjectDialog> implements OnDestroy {
  private dialogSub: ISubscription;
  private headerSub: ISubscription;
  public projectType: string = "empty";
  public isProjectAdd: boolean = true;
  public isAdd: boolean = true;

  constructor(
    el: ElementRef,
    private dialogSvc: CancelProjectDialogService,
    private authSvc: AuthService,
    private headerSvc: DialogHeaderService,
  ) {
    super(CancelProjectDialog, el, null);

    this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
      this.resetForm(profileSysId);
      this.buildModel();
    });
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.headerSub) {
      this.headerSub.unsubscribe();
    }
  }

  protected onSend(form: NgForm) {
    if (!form.valid) return;

    this.authSvc.forgotPassword(this.model.email).first().subscribe(x => {
      this.submitted = true;
    });
    // const req = new NewProjectRequest();
    // this.projectSub = this.projectSvc
    //   .newProject(req)
    //   .subscribe
    //   (
    //   r => {
    //     this.onSaveSuccess().then(_ => {
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 1500);
    //     });
    //   },
    //   e => this.onSaveError(e)
    //   );
  }

  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
        this.model = this.newModel();
        DialogHeader.SetProfileImageUrl(header);
        this.model.header = header;
        this.model.header.hideDetail = true;
        this.showDialog();
    }, e => this.onLoadError());
}
  // private buildModel() {
  //   this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
  //     this.model = this.newModel();
  //     DialogHeader.SetProfileImageUrl(header);
  //     this.model.header = header;
  //     this.model.budgetRange = this.budgetRanges[0];
  //     this.showDialog();
  //   }, e => this.onLoadError());
  // }



  
}
