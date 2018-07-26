import { Component, ElementRef, OnDestroy, Input } from '@angular/core';
import { HireAddExpenseRequestService } from './hire-addExpanseRequestforApproval.service';
import { HireProfileDialog, HireProfileRequest ,HireProfile} from './models';
import { ISubscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { NotificationsService } from 'angular2-notifications';
import { DialogHeaderService } from '../../dialogs/header/dialog-header.service';
import { masks } from 'shared/view/masks';
import { constants } from 'environments/constants';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { QuickSearchItem } from '../../components/quick-search/QuickSearchItem';
import { QuickSearchService } from '../../components/quick-search/quick-search.service';
import { AuthService } from 'auth/auth.service';
import { AdditionaKitComponent} from './../../components/additional-kit/additiona-kit.component';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { environment } from "environments/environment";
import { DatePipe } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { DataTable } from 'primeng/primeng';
declare var $:any;
import { 
    ViewChild, 
    ComponentFactoryResolver,
    ViewContainerRef } from '@angular/core';
import { LateFeePolicyDialogService } from '../../../payment-screen/dialogs/late-fee-policy/dialog.service';
import { CancelationPolicyDialogService } from '../../../payment-screen/dialogs/cancelation-policy/dialog.service';
import { HirePolicyDialogService } from '../../../payment-screen/dialogs/hire-policy/dialog.service';
import { HireProfileRequestDisplay, PaymentHire, OriginalPaymentDetail, negoiationHistory } from '../../../payment-screen/models'
@Component({
  selector: 'ij-hire-addExpanseRequestforApproval',
  templateUrl: 'hire-addExpanseRequestforApproval.component.html',
  styleUrls: ['styles.less'
              ],
  providers: [HireAddExpenseRequestService, DatePipe]
})
export class HireAddExpanseRequestComponent extends BaseDialogComponent<HireProfileDialog>  implements OnDestroy { 
  @ViewChild('parent', { read: ViewContainerRef }) container: ViewContainerRef;

  public modelContractor:HireProfile
  public modelContractee:HireProfile
  public modelData:HireProfileRequestDisplay
  public states = [];
  private qs$ = new Subject<string>();
  private dialogSub: ISubscription;
  private hireSub: ISubscription;
  private headerSub: ISubscription;
  private crewSub: ISubscription;
  private sub: ISubscription;
  protected get SaveMessage() {
    return "Your request has been sent.";
  }
   public id:number;

  @Input()
    set data(id:number)
    {
      this.id=id;
    } 
  @ViewChild("f") autoform;
  constructor(
    el: ElementRef,
    private activatedRoute:ActivatedRoute,
    private hireExpensiveSvc: HireAddExpenseRequestService,
    private lookupSvc: LookupService,
    notificationSvc: NotificationsService,
    private lateFeePolicyDialogService: LateFeePolicyDialogService,
    private cancelationPolicyDialogService: CancelationPolicyDialogService,
    private hirePolicyDialogService: HirePolicyDialogService,
    private datePipe: DatePipe,
    private  headerSvc : DialogHeaderService,
    private authSvc: AuthService, 
    private _cfr: ComponentFactoryResolver,
  ) {
        super(HireProfileDialog, el, notificationSvc); 

      
      this.states = lookupSvc.getStates(); 
       this.activatedRoute.params.subscribe((params:Params)=>{
        this.resetForm(params['id']);
      
       setTimeout(()=>{
        this.getHireDetails(this.id);
        } ,200);
       });

  }
  
  ngOnDestroy() {

    if(!this.model.crewRoles)
    {
    this.model.paymentDate = '';
    this.model.wrapDay = '';
    this.model.prepDay = '';
    this.model.shootDay = '';
    this.model.city = '';
    this.model.rate = null;
    this.model.state = '';
    this.model.crewRoles =[];
    this.model.productionCompany='';
  
    }


    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.hireSub) {
      this.hireSub.unsubscribe();
    }

    if (this.headerSub) {
      this.headerSub.unsubscribe();
    }

    if (this.crewSub) {
      this.crewSub.unsubscribe();
    }
  }


  private buildModelContractee(profileSysId:string) {
    this.headerSub = this.headerSvc.getData(profileSysId).subscribe(header => {
      this.modelContractee = this.newModel();
      DialogHeader.SetProfileImageUrl(header);
      this.modelContractee.header = header;
    }, e => this.onLoadError());
  }

  private buildModelContractor(profileSysId:string) {
    this.headerSub = this.headerSvc.getData(profileSysId).subscribe(header => {
      this.modelContractor = this.newModel();
      DialogHeader.SetProfileImageUrl(header);
      this.modelContractor.header = header;
    
    }, e => this.onLoadError());
  }

public getHireDetails(id)
{
  debugger;
  // alert(this.Id);
    this.hireExpensiveSvc.getHireDetails(id).subscribe(responsedata => {
    this.modelData = responsedata[0];
}) 

}


addComponent(id){   
  this.id=id;
  setTimeout(()=>{
     var len= $('#'+this.id.toString()).find('.kitList').length;
     localStorage.setItem("HireId",JSON.stringify(id));
     var comp = this._cfr.resolveComponentFactory(AdditionaKitComponent);
     if(len < 5 )
     {
        var expComponent = this.container.createComponent(comp);
        expComponent.instance._ref = expComponent;   
     }
  },200);

  this.hireExpensiveSvc.getHireDetails(id).subscribe(responsedata => {
  });        


}




}