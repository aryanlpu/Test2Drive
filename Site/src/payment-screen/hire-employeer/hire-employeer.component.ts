import { Component,ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router ,Params} from '@angular/router';
import {BrowserModule, DomSanitizer,SafeResourceUrl} from '@angular/platform-browser'
import { AuthService } from 'auth/auth.service';
import { PaymentScreenService } from './../payment.Screen.service'
import { HireProfileRequestDisplay,HireProfileDialog,UserProfileModel,PaymentHire } from '../models'
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
import { CancelationPolicyDialogService } from '..//dialogs/cancelation-policy/dialog.service';
import { HirePolicyDialogService } from  '../dialogs/hire-policy/dialog.service';
import { ViewPdfDialogService } from '../../shared/dialogs/view-pdf/dialog.service';
declare var $:any;
import { 
    ViewChild, 
    ComponentFactoryResolver,
    ViewContainerRef } from '@angular/core';


@Component({
    selector: 'ij-hire-employeer',
    templateUrl: './hire-employeer.component.html',
    styleUrls: ['../styles/hire.less','./styles.less'],
    providers: [DatePipe]
})

export class HireEmployeerComponent    implements OnInit  {
    @ViewChild('parent', { read: ViewContainerRef }) container: ViewContainerRef;
    modelData:HireProfileRequestDisplay;
    private model:UserProfileModel;
    private modelcontractee:UserProfileModel;
    private modelHire:PaymentHire;
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    public crewRoles:string[];
    public allCrewRoles: CrewRole[] = [];
    public crewRoleSuggestions: string[] = [];
    private crewSub: ISubscription;
    public IsRemoveButton: boolean = false;
    public acceptTerms: boolean = false;
    public hireTerms:boolean=false;
    public hireId:number;
    public id:number;
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
    public disabledOpacity :boolean;
    public enabledOpacity:boolean;
    pdfSrc:string = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    temp:any;
    page:number = 1;
    pageurl:SafeResourceUrl;
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
     private domSanitizer:DomSanitizer,
     private viewPdfDialogService:ViewPdfDialogService


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
            this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
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
    decreateOpacity()
    {

        this.disabledOpacity=true;
        this.enabledOpacity=false;

    }
    increaseOpacity()
    {
        this.enabledOpacity=true;
        this.disabledOpacity=false;
    }
     getHireDetail(id)
     {
            this.paymentScreenService.getHireDetails(id).subscribe(responsedata => {
            this.modelData = responsedata[0];
            this.modelData.wrapDay=(this.datePipe.transform(  this.modelData.wrapDay,'MM/d/yyyy'));
            
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
        this.paymentScreenService.acceptHireDetails(hireId,"AcceptedRate").subscribe(r=>{ 
            if (this.notificationSvc) {
            this.notificationSvc.success("Success", "Your Response has been sent.");
        };
    })  
    }

    negotiate(hireId:number)
    {
        this.hireId=hireId;
      
           if( this.modelData.id == this.hireId)
           {
             this.oldvalues={role: this.modelData.crewRoleDetails,rate:this.modelData.rate,rateType:this.modelData.rateType,shootDate:this.modelData.shootDate,prepDate:this.modelData.prepDate,wrapDate:this.modelData.wrapDay};
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
      
          console.log(this.allCrewRoles);

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
        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
            {
                if (this.notificationSvc) {
                    this.notificationSvc.success("Success", "Your Request has been sent.");
                };  
            });
      
            this.disabledrate=true;
         
      }

      savePrepDay(id,prepDay:any)
      {
          this.modelHire.id=id;
         debugger;
        if(( prepDay.indexOf(',')>0 && prepDay.length>10) || prepDay.length>10 )
        {
         var dateData = prepDay.split(',');
          this.modelHire.prepDay = new Array(dateData.length);
         
           for(var i = 0;i<dateData.length;i++)
           {
                this.modelHire.prepDay[i] = dateData[i];
           }
           
           this.modelHire.shootDay=null;
           this.modelHire.rate=null;
           this.modelHire.rateType=null;
           this.modelHire.crewRoleList=null;
           this.modelHire.wrapDay=null
        }
        else
        {
            this.modelHire.shootDay=null;
            this.modelHire.rate=null;
            this.modelHire.rateType=null;
            this.modelHire.crewRoleList=null;
            this.modelHire.wrapDay=null
            this.modelHire.prepDay=prepDay;
        }

          this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
            {
                if (this.notificationSvc) {
                    this.notificationSvc.success("Success", "Your Request has been sent.");
                };  
            });
      
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
        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
          {
              if (this.notificationSvc) {
                  this.notificationSvc.success("Success", "Your Request has been sent.");
              };  
          });
        this.disabledShootDay=true;
      
      }
      
      saveWrapDay(id,wrapDay)
      {
        this.modelHire.id=id;
        this.modelHire.wrapDay=wrapDay;

        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
        {
            if (this.notificationSvc) {
                this.notificationSvc.success("Success", "Your Request has been sent.");
            };  
       
        });

        this.disabledWrapDay=true;  
         
      }

    saveCrewRole(id,roles)
      {
        this.modelHire.id=id;
        this.modelHire.crewRoleList=roles;
        this.paymentScreenService.saveNagotiationDetail(this.modelHire).subscribe(r=>
        {
            if (this.notificationSvc) {
                this.notificationSvc.success("Success", "Your Request has been sent.");
            };          
        });

        this.disabledCrewRoles=true;        
      }
     
      negotiateNotification(id)
      {
           this.paymentScreenService.sendNegotiateNotification(id).subscribe(r=>
            {

                  if(this.notificationSvc)
                  {
                      this.notificationSvc.success("Success", "Your Request has been sent");
                  }
            });
            this.getHireDetail(id);
            this.hireId=0;
        }

        bindDateOnNegotiation()
        {
            let i=0;
            let j=0;
            this.modelData.shootDate='';
            this.modelData.prepDate='';
           for(let shootDate of   this.modelData.shootDay)
           {
              if(i==  this.modelData.shootDay.length-1)
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
              if(j ==  this.modelData.prepDay.length-1)
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
        showpdfDialog()
        {
        this.viewPdfDialogService.showDialog();
        }
   
        

}
