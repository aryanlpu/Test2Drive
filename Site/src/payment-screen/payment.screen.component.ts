
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { PaymentScreenHeaderComponent } from './payment.screen.header.component';
import { SiteSubHeaderComponent } from 'shared/components/site-subheader/site-subheader.component';
import { JobService } from '../project/job.service';
import { BaseProjectComponent } from '../project/BaseProjectComponent';
import { HireHistoryRequest, JobTypes, HireStatusTypes } from './models';
import { CancelProjectDialogService } from './dialogs/cancel-project/dialog.service';
import { ProjectDialogService } from 'shared/dialogs/project/dialog.service';
import { PaymentScreenService } from './payment.Screen.service'
import { HireProfileRequestDisplay,HireProfileDialog,UserProfileModel,PaymentHire } from './models'
@Component({
  selector: 'ij-payment-screen',
  templateUrl: './payment.screen.component.html',
  styleUrls: ['./styles.less'],
  providers:[CancelProjectDialogService]
})
export class PaymentScreenComponent  extends BaseProjectComponent implements OnInit {
public title:string="Welcome to Showbiz";
private pageNo: number = 1;
public modelAcceptRate:HireProfileRequestDisplay;
public hireStatusTypes = HireStatusTypes;
public isRateAccepted:boolean = false;
public isNagatiationApproved:boolean = true;
  constructor(
    route: ActivatedRoute,
    private paymentScreenService:PaymentScreenService,
    router: Router,
    private routerNav:Router,
   jobSvc: JobService,
   cancelProjectDlg: CancelProjectDialogService,
   private dialogSvc: ProjectDialogService,
   private auth: AuthService,
  ) {
    super(route, router, jobSvc,null);
  }

  ngOnInit() {
    let request = new HireHistoryRequest();
    request.page = this.pageNo;
    request.jobType = JobTypes.All;
    this.getJobs(request);
    let isNull = localStorage.getItem("hireId");
    if(isNull == "null")
    {
          this.isNagatiationApproved = true;
      }
  else
  {
    this.paymentScreenService.getHireDetails(Number(isNull)).subscribe(responsedata => {
      this.modelAcceptRate =  responsedata[0];
      if(this.modelAcceptRate.isRateAccepted)
      {
        this.isNagatiationApproved = false;
      }
     });  
  }
  }
 setTitle(title:string)
 {
   this.title=title;
 }


onNewProject() {
  this.dialogSvc.newProject(this.auth.profileSysId);
}

 
onHire(hireId: string,isRateAccepted:boolean) {
    this.isRateAccepted = isRateAccepted;
    localStorage.setItem("hireId",hireId.toString()); 
    this.routerNav.navigate(['/hire/All',{'action':'project'}]);
    this.routerNav.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
  this.routerNav.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
          this.routerNav.navigated = false;
    
      }
  });
}
onHireTabEnable()
{
  if(this.isNagatiationApproved)
  {
    return true;
  }
  else
  {

    return false;
  }
}
// isDisabled()
// {
//   let isNull = localStorage.getItem("hireId");
//   let IsAccepted = localStorage.getItem("AcceptedRate");
//    if(isNull != 'null' && !this.isRateAccepted )
//   {
//     return true;
//   }
//   else
//   {
//     return false;
//   }
// }

}
