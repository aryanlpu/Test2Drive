import { Component, ElementRef, OnDestroy, ViewChild, Input } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { NgForm, Validators } from '@angular/forms';
import { CancelProjectDialogService } from './dialog.service';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { CancelProjectDialog , CancelProjectRequestDialog,CancelOption } from './models'
import { AuthService } from 'auth/auth.service'
import 'rxjs/add/operator/first';
import { DialogHeaderService } from 'shared/dialogs/header/dialog-header.service';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { ProjectService } from './../../dialogs/cancel-project/project.service';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'ij-request-cancellation-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./styles.less'],
  providers: [ProjectService]
})
export class CancellationRequestComponent extends BaseDialogComponent<CancelProjectRequestDialog> implements OnDestroy {
  private dialogSub: ISubscription;
  private headerSub: ISubscription;
  private canclerequestproject: ISubscription;
  public projectType: string = "empty";
  public isProjectAdd: boolean = true;
  public isAdd: boolean = true;
  public cancelOptions: CancelOption[];
  public CancelProjectRequestDialogs: CancelProjectRequestDialog[];
  public hireid: number;
  message : string;
  private form: NgForm;
  public model : CancelProjectRequestDialog;
  // public cancellationOption1:boolean;
  // public cancellationOption2:boolean;
  // public cancellationOption3:boolean;
  public cancelOption:string;

  constructor(
    el: ElementRef,
    private dialogSvc: CancelProjectDialogService,
    private cancelprojectsvc: ProjectService,
    private authSvc: AuthService,
    private headerSvc: DialogHeaderService,
    private auth:AuthService,
    private notification:NotificationsService
  ) {
    super(CancelProjectDialog, el, null);

    this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
      this.resetForm(profileSysId);
      this.buildModel();
    });
    this.dialogSub = this.dialogSvc.showDialogId$.subscribe(id => {
     this.hireid = id;
    });
    
  }
 
  protected get SaveMessage() {
    return "Your request has been sent.";
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
  }

  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.auth.profileSysId).subscribe(header => {
        this.model = this.newModel();
        DialogHeader.SetProfileImageUrl(header);
        this.model.header = header;
        // this.model.header.hideDetail = true;
        this.showDialog();
    }, e => this.onLoadError());
}
 

  onCancel()
  {
    debugger;
    const req = new CancelProjectRequestDialog();
    req.hireId = this.hireid;
    req.isMutual = false;
    req.message =  this.model.message;
    req.cancellationOptions=this.cancelOption;
    
    this.canclerequestproject = this.cancelprojectsvc.newProject(req)
    .subscribe
      (
      r => this.onCallSaveSuccess(),
      e => this.onSaveError(e),
    );
  }


    
  private onCallSaveSuccess() {
    this.showSaveErrored = false;
    this.errors = [];

    if (this.notification) {
        this.notification.success("Success", "Your request have been sent.");
    }
   
}


  onMutualCancel()
  {

    debugger;
    const req = new CancelProjectRequestDialog();
    req.hireId = this.hireid;
    req.isMutual = true;
    req.message =  this.model.message;
    req.cancellationOptions=this.cancelOption;
    
    this.canclerequestproject = this.cancelprojectsvc.MutualCancelProject(req)
    .subscribe
      (
      r => this.onSaveSuccess(),
      e => this.onSaveError(e),
    );




  }



  private onGetError(e) {
  }
}
