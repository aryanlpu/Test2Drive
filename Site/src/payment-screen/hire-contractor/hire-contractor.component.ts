import { Component,ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router ,Params, convertToParamMap} from '@angular/router';
import {BrowserModule, DomSanitizer,SafeResourceUrl} from '@angular/platform-browser'
import { AuthService } from 'auth/auth.service';
import { PaymentScreenService } from './../payment.Screen.service'
import { HireProfileRequestDisplay,HireProfileDialog,UserProfileModel,PaymentHire,OriginalPaymentDetail, negoiationHistory } from '../models'
import { DialogHeaderService } from '../../shared/dialogs/header/dialog-header.service'
import { DatePipe } from '@angular/common';
import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { CurrencyPipe } from '@angular/common'
import { ISubscription } from 'rxjs/Subscription';
import { BaseDialogComponent } from '../../shared/dialogs/BaseDialogComponent'
import { NotificationsService } from 'angular2-notifications';
import { DialogHeader } from '../../shared/dialogs/header/DialogHeader'
import { environment } from 'environments/environment';
import { PrivatePolicyDialogService } from '../../signup/private-policy-dialog/dialog.service';
import { DOCUMENT } from '@angular/platform-browser';
import { AdditionaKitComponent} from '../../shared/components/additional-kit/additiona-kit.component';
import { CancelationPolicyDialogService} from '../dialogs/cancelation-policy/dialog.service';
import { HirePolicyDialogService } from  '../dialogs/hire-policy/dialog.service';
import { DenyRequestDialogService } from '../dialogs/deny-request/dialog.service';
import { CancelProjectDialogService } from '../dialogs/cancel-project/dialog.service';
import { ProfileService } from '../../profile/profile.service';
declare var $:any;
import { 
    ViewChild, 
    ComponentFactoryResolver,
    ViewContainerRef } from '@angular/core';
import { LocalStorage } from '@ng-idle/core';
import { debounce, isEmpty } from 'rxjs/operators';
import { isNull } from 'util';
import { forEach } from '@angular/router/src/utils/collection';
import { strictEqual } from 'assert';


@Component({
    selector: 'ij-hire-contractor',
    templateUrl: './hire-contractor.component.html',
    styleUrls: ['../styles/hire.less','./styles.less'],
    providers: [DatePipe]
})

export class HireContractorComponent    implements OnInit  {
    @ViewChild('parent', { read: ViewContainerRef }) container: ViewContainerRef;
    modelData:HireProfileRequestDisplay;
    private model:UserProfileModel;
    private modelcontractee: UserProfileModel;
    public OriginalPaymentDetails: OriginalPaymentDetail;
    public  originalPayments: boolean = false;
    private modelHire: PaymentHire;
    public rateChanged: boolean = false;
    public prepDayChanged: boolean = false;
    public shootDayChanged: boolean = false;
    public wrapDayChanged: boolean = false;
  public crewRolesChanged: boolean = false;
  public totalPaymentTwoDigit: string;
  public denied: boolean = false;
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    public negotiateDone: Boolean = false;
  public noWrapDay: boolean = false;
  public deductionTwoDigit: string;
    public noPrepDays: boolean = false;
  public NegoId: string;
    public negoiationHistory: negoiationHistory[]=[];
    public NegoDate: string;
    public crewRoles:string[];
    public allCrewRoles: CrewRole[] = [];
    public crewRoleSuggestions: string[] = [];
    private crewSub: ISubscription;
    public IsRemoveButton: boolean = false;
    public acceptTerms: boolean = false;
    public hireTerms: boolean = false;
    public denyContractor: boolean = false;
    public denyContractee: boolean = false;
    public hireId: number;
    requiredPolicy:boolean = false;
    public NegotiationMade: boolean = false;
    public responseNegotiaation: boolean = false;
    public negotiationHistory: boolean = false;
    public LoginIdProfile: string;
    public initialHireRequest: boolean = false;
    isW9Uploaded: boolean = false;
    public id: number;
    public dates: number;
  
    public oldvalues:{
        role:string[];
        rate:number;
        rateType:string;
        shootDate:string;
        prepDate:string;
        wrapDate:string;
    };
    public disabledrate:boolean=false;
    public disabledPrepDay:boolean=false;
    public disabledShootDay:boolean=false;
    public disabledWrapDay:boolean=false;
    public disabledCrewRoles:boolean=false;
    public additionalfees : number = 0;
    public disabledOpacity:boolean=true;
    public enabledOpacity:boolean=false;
    public addExpense:boolean=false;
    public valid: boolean = false;
    pdfSrc: string = 'http://www.orimi.com/pdf-test.pdf';
    images=[{source:'../../assets/images/w9.png', thumbnail: '../../assets/accept_hireImages/w9.jpg'}];
    constructor(
    private paymentScreenService:PaymentScreenService,
    private lookupSvc: LookupService,
    private authservice:AuthService,
    private activatedRoute: ActivatedRoute,
    private headerSvc: DialogHeaderService,
    private notificationSvc: NotificationsService,
    private privatePolicySvc: PrivatePolicyDialogService,
    private datePipe: DatePipe,
    private _cfr: ComponentFactoryResolver,
    private cancelationPolicyDialogService:CancelationPolicyDialogService ,
    private hirePolicyDialogService:HirePolicyDialogService,
    private denyRequestDialogService: DenyRequestDialogService,
    private router: Router,
    private cancelDialogService:CancelProjectDialogService,
    private profileService: ProfileService
   
     ) {
    
        this.modelHire = new PaymentHire();

        this.cancelationPolicyDialogService.acceptTerms$.subscribe(term => {
            this.acceptTerms = term;
        });
        this.hirePolicyDialogService.acceptTerms$.subscribe(term => {
            this.hireTerms = term;
        });
    }
    
    ngOnInit() {
     
        let hireId:number
            hireId =  Number(localStorage.getItem("hireId"));
              this.getHireDetail(hireId);
             this.getCrewRoles();
             this.getNegoiationHistory(hireId);
            this.activatedRoute.params.subscribe((params: Params) => {
                this.addExpense = params['addExpense'];
               if(this.addExpense == undefined)
               {
                this.addExpense=false;
               }
               else{
                  window.scrollTo(0,800);
               }
             
      });
      this.profileService.getSettings().subscribe( r => { 
        if(r.w9)
        {
          this.isW9Uploaded = true;
        }
      });
    }

    onSelectionChange(selection:boolean)
    {
      this.acceptTerms = selection;
      this.requiredPolicy = false;
     
    }

    onSelectionRadioChange(selection:boolean)
    {
       this.hireTerms = selection;
       this.requiredPolicy = false;
    }

           public increaseOpacity()
        {
            this.disabledOpacity=false;
            this.enabledOpacity=true;
        }

        public decreasedOpacity()
        {
            this.disabledOpacity=true;
            this.enabledOpacity=false;
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

             this.paymentScreenService.getHireDetails(id).subscribe(responsedata => {
             });        
          
        
  }

  getNegoiationHistory(id) {
    this.paymentScreenService.getNegoiationHistory(id).subscribe(responedata => {
      debugger;
      this.negoiationHistory = responedata;
    })
  }

     getHireDetail(id)
     {
      
     
      this.originalPayments = true;     
        this.LoginIdProfile = this.authservice.profileSysId.match(/\d/g).toString();
     
            this.paymentScreenService.getHireDetails(id).subscribe(responsedata => {
              this.modelData = responsedata[0];
              if (this.modelData.prepDay.length == 0) {
                this.noPrepDays = true;
              }
              if (!this.modelData.wrapDay) {

                this.noWrapDay = true;

              }
              else {
                this.noWrapDay = false;
              }
              this.NegoId = responsedata[0].hiredProfileId;            
              if (responsedata[0].nego != null || responsedata[0].Nego != '') {
                if (responsedata[0].nego == this.NegoId) {

                    this.negotiationHistory = true;
                    this.NegotiationMade = true;
                    this.NegoDate = responsedata[0].negoDate;
                  this.negotiateDone = true;
                  this.denyContractee = false;
                  this.denyContractor = false;
                  this.denied = false;

                  if (responsedata[0].denyBy != null && responsedata[0].denyBy != '') {
                    this.denyContractee = true;
                    this.denyContractor = false;
                    this.denied = true;
                  }
               

                    this.paymentScreenService.getHireDetailsOriginal(id).subscribe(originalPaymentDetail => {
                    this.OriginalPaymentDetails = originalPaymentDetail;
                      // this.originalPayments = true;
                       

                      if ((this.modelData.rate != this.OriginalPaymentDetails.rate) || (this.modelData.rateType != this.OriginalPaymentDetails.rateType)) {
                        this.rateChanged = true;

                      }
                      this.modelData.wrapDay = (this.datePipe.transform(this.modelData.wrapDay, 'MM/d/yyyy'));
                      this.OriginalPaymentDetails.wrapDay = (this.datePipe.transform(this.OriginalPaymentDetails.wrapDay, 'MM/d/yyyy'));
                      if (this.modelData.wrapDay != this.OriginalPaymentDetails.wrapDay) {
                        this.wrapDayChanged = true;
                      }
                      for(var a in this.modelData.prepDay) {
                        this.modelData.prepDay[a] = this.datePipe.transform(this.modelData.prepDay[a], 'MM/d/yyyy');
                      }
                      for (var b in this.OriginalPaymentDetails.prepDay) {
                        this.OriginalPaymentDetails.prepDay[b] = this.datePipe.transform(this.OriginalPaymentDetails.prepDay[b], 'MM/d/yyyy');
                      }
                      if (this.modelData.prepDay.length != this.OriginalPaymentDetails.prepDay.length) {
                        this.prepDayChanged = true;
                      }
                      else {
                        let missing = this.modelData.prepDay.filter(item => this.OriginalPaymentDetails.prepDay.indexOf(item) < 0);
                        if (missing.length != 0) {
                          this.prepDayChanged = true;
                        }
                      }
                      for (var a in this.modelData.shootDay) {
                        this.modelData.shootDay[a] = this.datePipe.transform(this.modelData.shootDay[a], 'MM/d/yyyy');
                      }
                      for (var b in this.OriginalPaymentDetails.shootDay) {
                        this.OriginalPaymentDetails.shootDay[b]= this.datePipe.transform(this.OriginalPaymentDetails.shootDay[b], 'MM/d/yyyy');
                      }
                      if (this.modelData.shootDay.length != this.OriginalPaymentDetails.shootDay.length) {
                        this.shootDayChanged = true;
                      }
                      else {
                        debugger;
                        let missing = this.modelData.shootDay.filter(item => this.OriginalPaymentDetails.shootDay.indexOf(item) < 0);
                        if (missing.length != 0) {
                          this.shootDayChanged = true;
                        }
                      }
                      debugger;
                      var crewRolesOriginal = this.OriginalPaymentDetails.crewRoles.split(',');
                      var newRoles=this.modelData.crewRoles.split(',');
                         
                      
                      if (this.modelData.crewRoles != this.OriginalPaymentDetails.crewRoles) {
                        this.crewRolesChanged = true;
                      }
                   
                  })
                  if (responsedata[0].hiredByProfileID == this.LoginIdProfile) {
                    this.NegotiationMade = false;
                    this.responseNegotiaation = true;
                    this.negotiationHistory = true;
                    if (responsedata[0].denyBy != null && responsedata[0].denyBy != '') {
                      this.denyContractee = false;
                      this.denyContractor = true;
                      this.denied = true;
                    }
                  
                  }
                  else if (responsedata[0].hiredByProfileID == this.LoginIdProfile) {
                    this.initialHireRequest = true;

                  } 

                }
              }


              var rateType = this.modelData.rateType;
              if (rateType.toLocaleLowerCase() == 'daily') {

                this.dates = this.modelData.shootDay.length + this.modelData.prepDay.length;
                if (this.modelData.wrapDay != '' && this.modelData.wrapDay != undefined) {
                  this.dates = this.dates + 1;
                }
                this.modelData.TotalPayment = this.modelData.rate * this.dates;
                this.modelData.Deduction = this.modelData.TotalPayment * (5 / 100);
                this.deductionTwoDigit=this.modelData.Deduction.toFixed(2);

                //this.modelData.Deduction = Number((this.modelData.Deduction.toFixed(2)));
                if (this.modelData.Deduction > 50) {
                  this.modelData.Deduction = 50;
                }
               
                this.modelData.TotalPaymentAfterTax = this.modelData.TotalPayment - this.modelData.Deduction;
                this.totalPaymentTwoDigit = this.modelData.TotalPaymentAfterTax.toFixed(2);
              
              }
              else {
                this.modelData.Deduction = this.modelData.rate * (5 / 100);
                this.deductionTwoDigit = this.modelData.Deduction.toFixed(2);
                //this.modelData.Deduction = Number((this.modelData.Deduction.toFixed(2)));
                if (this.modelData.Deduction > 50) {
                  this.modelData.Deduction = 50;
                }
                this.modelData.TotalPayment = this.modelData.rate;
                this.modelData.TotalPaymentAfterTax = this.modelData.TotalPayment - this.modelData.Deduction;
                this.totalPaymentTwoDigit = this.modelData.TotalPaymentAfterTax.toFixed(2);
       
              }

            this.modelData.wrapDay=(this.datePipe.transform(this.modelData.wrapDay,'MM/d/yyyy'));
            
            this.lookupSvc.getKitDetails(id).subscribe(data=>
                {
                  var model = data;
                  model.forEach(element => {
                    this.additionalfees = this.additionalfees + element.rate;
                  });
                });
            this.bindDateOnNegotiation();
       });
     }

    onBeforeSend(event) {
        if (event.xhr) {
            event.xhr.setRequestHeader('Authorization', this.authservice.bearer);
        }
    }


    acceptHireDetail(hireId:number)
    {
      if((this.acceptTerms && this.hireTerms) || this.responseNegotiaation || this.negotiateDone)
      {
         this.paymentScreenService.acceptHireDetails(hireId,"AcceptedRate").subscribe(r=>{ 
            if (this.notificationSvc) {
              this.notificationSvc.success("Success", "Your Response has been sent.");
              this.router.navigate(['hire/payment-status']);
           };
         }) 
      } 
      else
      {
        this.requiredPolicy = true;
      }
    }

    negotiate(hireId:number)
    {
      if(this.acceptTerms && this.hireTerms|| this.responseNegotiaation || this.negotiateDone)
      {
        this.hireId=hireId;
        if( this.modelData.id == this.hireId)
          {
            this.oldvalues = {role: this.modelData.crewRoleDetails,rate:this.modelData.rate,rateType:this.modelData.rateType,shootDate:this.modelData.shootDate,prepDate:this.modelData.prepDate,wrapDate:this.modelData.wrapDay};
           
          }
      }
      else{
        this.requiredPolicy = true;
      }  
    }

    negotiateApproved(id,rate,rateType,prepDay,shootDay,wrapDay,crewRoles)
    {
        this.modelHire.id=id;
        this.modelHire.rate=rate;
        this.modelHire.rateType=rateType;
        this.modelHire.prepDay=prepDay;
        this.modelHire.shootDay=shootDay;
        this.modelHire.wrapDay=wrapDay;
        this.modelHire.crewRoleList=crewRoles;
      
        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
            {
                if (this.notificationSvc) {
                    this.notificationSvc.success("Success", "Your Response has been sent.");
                };  
            });
      
     this.disabledrate=true;
    }
    getImageUrl(imageUrl: string){
          
        if (imageUrl) {
            return environment.site.imageUrl(imageUrl);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    showPrivatePolicyDialog() {
        this.privatePolicySvc.showDialog();
    }
   
   
    private getCrewRoles() {
        this.crewSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
          this.allCrewRoles = crewRoles;
        }, e => this.onLoadError());
      }

      protected onLoadError() {
        if (this.notificationSvc) {
          this.notificationSvc.error("Error", "Please try again, later.");
        }
      }


      onCrewRolesKeyDown(event,crewRole:any) {
       
         if (crewRole && crewRole.length >= 3) return [];
          let query = (event.query || "").toLocaleLowerCase();
          this.crewRoleSuggestions = this.allCrewRoles
          .filter(f => f.label.indexOf(query) != -1)
          .map(r => r.label);
      }
      getOriginal(data:string, id:number)
      {

     
           if(this.modelData.id == this.hireId && data=='role')
           {
            this.modelData.crewRoleDetails=this.oldvalues.role;
           }
           if(this.modelData.id == this.hireId && data=='rate')
           {
            this.modelData.rate=this.oldvalues.rate;
            this.modelData.rateType=this.oldvalues.rateType;
           }
           if(this.modelData.id == this.hireId && data=='shootDate')
           {
            this.modelData.shootDate=this.oldvalues.shootDate;
           }
           if(this.modelData.id == this.hireId && data=='prepDate')
           {
            this.modelData.prepDate=this.oldvalues.prepDate;
           }
           if(this.modelData.id == this.hireId && data=='wrapDate')
           {
            this.modelData.wrapDay=this.oldvalues.wrapDate;
           }
        
      }


      saveRate(id,rate,rateType)
      {
     
        this.modelHire.id=id;
        this.modelHire.rate=rate;
        this.modelHire.rateType=rateType;  
      
            this.disabledrate=true;
         
      }

      savePrepDay(id,prepDay:any)
      {
        
         this.disabledPrepDay=true;
            
      }
      
      saveShootDay(id,shootDay:any)
      {
        this.modelHire.id=id;
        if((shootDay.indexOf(',')>0 && shootDay.length>=10) || shootDay.length>=10 )
        {
         var dateData = shootDay.split(',');
          this.modelHire.shootDay = new Array(dateData.length);
         
           for(var i = 0;i<dateData.length;i++)
           {
                this.modelHire.shootDay[i] = dateData[i];
           }
           this.modelHire.prepDay=null;
        }
        else
        {
            this.modelHire.prepDay=null;
            this.modelHire.wrapDay=null;
            this.modelHire.shootDay=shootDay;
        }

        this.modelHire.shootDay=shootDay;
        this.disabledShootDay=true;
      
      }
      
      saveWrapDay(id,wrapDay)
      {
        this.modelHire.id=id;
        this.modelHire.wrapDay=wrapDay;

        this.disabledWrapDay=true;  
         
      }

    saveCrewRole(id,roles)
      {
        this.modelHire.id=id;
        this.modelHire.crewRoleList=roles;
        this.disabledCrewRoles=true;        
      }
     
      negotiateNotification(id)
      {
       
        debugger;
       
        var Id = this.modelData.id;

        var rate = this.modelData.rate;

        var rateType = this.modelData.rateType;

        var shootDay = this.modelData.shootDate;

        var prepDay = this.modelData.prepDate;

        var wrapDay = this.modelData.wrapDay;

        var crewRoleDetail = this.modelData.crewRoleDetails;

       
        this.modelHire.id = Id;
        if (this.disabledrate == true) {
          this.modelHire.rate = rate.toString();
        }
        this.modelHire.rateType = rateType;

        if (this.disabledPrepDay == true) {
          if ((prepDay.indexOf(',') > 0 && prepDay.length >= 10) || prepDay.length >= 10) {
            var dateData = prepDay.split(',');
            this.modelHire.prepDay = new Array(dateData.length);

            for (var i = 0; i < dateData.length; i++) {
              this.modelHire.prepDay[i] = dateData[i];
            }
            
          }
          else {
            this.modelHire.prepDay = new Array(prepDay.length)
              for (var i = 0; i < prepDay.length; i++) {
              this.modelHire.prepDay[i] = prepDay[i];
            }
           
          }


          
        }
        if (this.disabledShootDay == true) {

          if ((shootDay.indexOf(',') > 0 && shootDay.length >= 10) || shootDay.length >= 10) {
            var dateData = shootDay.split(',');
            this.modelHire.shootDay = new Array(dateData.length);

            for (var i = 0; i < dateData.length; i++) {
              this.modelHire.shootDay[i] = dateData[i];
            }
            
          }
          else {
         
            this.modelHire.shootDay = new Array(shootDay.length)
              for (var i = 0; i < shootDay.length; i++) {
              this.modelHire.shootDay[i] = shootDay[i];
            }
           
          }
         
        }
        if (this.disabledWrapDay == true) {
          
          this.modelHire.wrapDay = wrapDay;
        }
        if (this.disabledCrewRoles == true) {

          this.modelHire.crewRoleList = this.modelData.crewRoleDetails;
        }
     
        
        this.modelHire.Nego = "yes";
        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r => {
          this.getHireDetail(id);
          this.getNegoiationHistory(id);
          this.hireId = 0;
        });
           this.paymentScreenService.sendNegotiateNotification(id).subscribe(r=>
            {

                  if(this.notificationSvc)
                  {
                      this.notificationSvc.success("Success", "Your Request has been sent");
                  }
            });
         
        }

        bindDateOnNegotiation()
        {
            let i=0;
            let j=0;
            this.modelData.shootDate='';
            this.modelData.prepDate='';
           for(let shootDate of   this.modelData.shootDay)
           {
              if(i==this.modelData.shootDay.length-1)
              {
                this.modelData.shootDate+=(this.datePipe.transform(shootDate,'MM/d/yyyy'));
               
              }
              else{
                this.modelData.shootDate+=(this.datePipe.transform(shootDate,'MM/d/yyyy'))+',';
              } 
              i++;
           }
           for(let prepDate of   this.modelData.prepDay)
           {
              if(j==this.modelData.prepDay.length-1)
              {
                this.modelData.prepDate+=(this.datePipe.transform(prepDate,'MM/d/yyyy'));
               
              }
              else{
                this.modelData.prepDate+=(this.datePipe.transform(prepDate,'MM/d/yyyy'))+',';
              } 
              j++;
           }
        }

        showCancelPolicy()
        {
            this.cancelationPolicyDialogService.showDialog();
        }

        showHirePolicy()
        {
          this.hirePolicyDialogService.showDialog();

        }
        denyRequest(hireId)
        {
            this.denyRequestDialogService.showDialog();       
        }
        
       deniedNegotation(hireId)
       {
     

        this.paymentScreenService.deniedNagotiationRequest(hireId).subscribe(r => {

          if(this.notificationSvc)
          {
              this.notificationSvc.success("Success", "Your Request has been sent");
          }
           
        
          this.getHireDetail(hireId);
          this.getNegoiationHistory(hireId);
          this.originalPayments = false;
         
        });




       }

       cancelDialogbox()
       {
           this.cancelDialogService.showDialog(this.authservice.profileSysId,this.modelData.id);
       }


      
}
