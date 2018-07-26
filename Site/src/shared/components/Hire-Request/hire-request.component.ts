import { Component, ElementRef, OnDestroy, ViewChild,Input } from '@angular/core';
import { HireRequestService } from './hire-request.service';
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

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { environment } from "environments/environment";
import { DatePipe } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { DataTable } from 'primeng/primeng';

import { LateFeePolicyDialogService } from '../../../payment-screen/dialogs/late-fee-policy/dialog.service';
import { CancelationPolicyDialogService } from '../../../payment-screen/dialogs/cancelation-policy/dialog.service';
import { HirePolicyDialogService } from '../../../payment-screen/dialogs/hire-policy/dialog.service';
@Component({
  selector: 'ij-hire-request',
  templateUrl: 'hire-request.component.html',
  styleUrls: ['../../../payment-screen/styles/hire.less',
              'styles.less'
              ],
  providers: [HireRequestService, DatePipe]
})
export class HireRequestComponent extends BaseDialogComponent<HireProfileDialog>  implements OnDestroy { 

  public modelContractor:HireProfile
  public modelContractee:HireProfile
  public rateMask = createNumberMask({prefix: '' });
  public allCrewRoles: CrewRole[] = [];
  public crewRoleSuggestions: string[] = [];
  public allProjectTypes: string[] = [];
  public allSongTitles: any = [];
  public allEpisodeTitles: string[] = [];
  public projectTypeSuggestions: string[] = [];
  public songTitleSuggestions: any = [];
  public suggestions: any = [];
  public filteredSuggestions: any = [];
  public episodeTitleSuggestions: any = [];
  public  projectName: string;
  private dialogSub: ISubscription;
  private hireSub: ISubscription;
  private headerSub: ISubscription;
  private crewSub: ISubscription;
  public states = [];
  private qs$ = new Subject<string>();
  private sub: ISubscription;
  public input: string = null;
  public projectType: string;
  public projectTitle:string;
  public projectId: number;
  public newModeType: any;
  public episodeTitle: string;
  public songTitle: string;
  public isAdd: boolean = true;
  public preDay: string='';
  public shootDay: string='';
  public acceptTerms: boolean;
  public hireTerms: boolean;
  public lateFees: boolean;
  public disabledOpacity : boolean;
  public enabledOpacity: boolean;
  requiredPolicy: boolean = false;
  public cityState: boolean = true;
  protected get SaveMessage() {
    return "Your request has been sent.";
  }
  @ViewChild("f") autoform;
  constructor(
    el: ElementRef,
    private activatedRoute:ActivatedRoute,
    private hireSvc: HireRequestService,
    private lookupSvc: LookupService,
    notificationSvc: NotificationsService,
    private lateFeePolicyDialogService: LateFeePolicyDialogService,
    private cancelationPolicyDialogService: CancelationPolicyDialogService,
    private hirePolicyDialogService: HirePolicyDialogService,
    private datePipe: DatePipe,
    private  headerSvc : DialogHeaderService,
    private authSvc: AuthService,  
  ) {
        super(HireProfileDialog, el, notificationSvc); 

        this.cancelationPolicyDialogService.acceptTerms$.subscribe(term => {
          this.acceptTerms = term;
        });
        this.hirePolicyDialogService.acceptTerms$.subscribe(term => {
            this.hireTerms = term;
        });
        this.lateFeePolicyDialogService.acceptTerms$.subscribe(term => {
          this.lateFees = term;
        });
    this.states = lookupSvc.getStates(); 
   
       this.activatedRoute.params.subscribe((params:Params)=>{
        this.resetForm(params['id']);
        this.getLocalDropdowns();
        this.getCrewRoles();
        this.buildModelContractee(params['id']);
        this.buildModelContractor(this.authSvc.profileSysId);
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
    this.preDay='';
    this.shootDay='';
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

  onCrewRolesKeyDown(event) {

    if (this.model.crewRoles && this.model.crewRoles.length >= constants.roles.maxRoles) return [];

    let query = (event.query || "").toLocaleLowerCase();
    this.crewRoleSuggestions = this.allCrewRoles
      .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r.label);
     
  }

  onProjectTypesKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.projectTypeSuggestions = this.allProjectTypes
      .filter(f => f.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r);

  }

  hasUserFromSystem(value) {

    this.model.showTitle = true;

    if (typeof value === 'string' || value instanceof String) {
      this.model.projectName = value.toString()
    }
    else {
      this.model = value;
      var role = [];
      value.crewRoles.replace(/[\[\]']+/g, '');
      var splitRole = value.crewRoles.split(",");
      for (var i = 0; i < splitRole.length; i++) {

        var roleIndex = this.allCrewRoles.map((el) => el.label).indexOf(splitRole[i].trim())
        this.crewRoleSuggestions = this.allCrewRoles
          .filter(f => f.label.toLocaleLowerCase().indexOf(splitRole[i].trim().toLocaleLowerCase))
          .map(r => r.label);

        role.push(this.crewRoleSuggestions[roleIndex]);

      }
      this.model.crewRoles = [];

    }
  }





  selectProjectType(event) {
    this.projectType = event;
  }

  selectSongTitle(value:HireProfileDialog) {

    this.model.songTitle = value.songTitle;
    this.model.artistTitle = value.artistTitle;
    this.model.projectType = value.projectType;
    this.model.productionCompany = value.productionCompany;
    this.model.rateType = value.rateType;
    this.model.city = value.city;
    this.model.state = value.state;
    this.model.paymentDate = this.datePipe.transform(value.paymentDate, 'MM/d/yyyy');
    this.model.crewRoles = [];
    this.shootDay="";
    for(let i = 0; i<value.shootDay.length; i++)
    {
       let shootDate = value.shootDay[i];
       if(i == value.shootDay.length-1)
       {
      
        this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'));
     
       }
       else{
        this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'))+',';
         
       }       
    }
  
   this.model.shootDay=this.shootDay;   
   this.model.prepDay= this.preDay;

  }

  onSongTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();
    this.getSongTitles(query, this.model.projectType);
  }

  selectEpisodeTitle(value:HireProfileDialog) {

   this.model.episodeTitle = value.episodeTitle;
   this.model.seriesTitle = value.seriesTitle;
   this.model.projectType = value.projectType;
   this.model.productionCompany = value.productionCompany;
   this.model.rateType = value.rateType;
   this.model.city = value.city;
   this.model.state = value.state;
   this.model.paymentDate = this.datePipe.transform(value.paymentDate, 'MM/d/yyyy');
   this.model.crewRoles = [];
   this.shootDay="";
   for(let i = 0; i<value.shootDay.length; i++)
   {
      let shootDate = value.shootDay[i];

      if(i==value.shootDay.length-1)
      {
     
       this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'));
    
      }
      else{
       this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'))+',';
        
      }       
   }
 
  this.model.shootDay = this.shootDay;   
  this.model.prepDay = this.preDay;

  }

  onEpisodeTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();
    this.getEpisodeTitles(query, this.model.projectType);
  }


  onKeyDown(event) {
    let query = (event.query || event).toLocaleLowerCase();

    this.projectsByTitle(query, this.model.projectType);
  }

  onSelect(value:HireProfileDialog) {
 
    setTimeout(() => {
    if (this.model.projectType != "Web Series" && this.model.projectType != "Television Show" && this.model.projectType != "Music Video") {
      this.newModeType = value.newModeType;
      this.model.projectName = value.projectName;
       this.episodeTitle = undefined;
       this.songTitle = undefined;
      
     }

    if (this.model.projectType == "Web Series" || this.model.projectType == "Television Show") {
       this.newModeType = undefined;
       this.songTitle = undefined;
       this.episodeTitle = value.episodeTitle;
     }

     if (this.model.projectType == "Music Video") {
       this.newModeType = undefined;
       this.episodeTitle = undefined;
       this.songTitle = value.songTitle;
     
     }
   }, 500);
    this.model.projectType = value.projectType;
    this.model.productionCompany = value.productionCompany;
    this.model.rateType = value.rateType;
    this.model.city = value.city;
    this.model.state = value.state;
    this.model.paymentDate = this.datePipe.transform(value.paymentDate, 'MM/d/yyyy');
    this.model.crewRoles = [];
    this.shootDay="";
    for(let i = 0; i<value.shootDay.length; i++)
    {
       let shootDate = value.shootDay[i];

       if(i==value.shootDay.length-1)
       {
      
        this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'));
     
       }
       else{
        this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'))+',';
         
       }       
    }
  
   this.model.shootDay=this.shootDay;   

  }

  onKey(event) {

  }

  protected onClear() {
   
    this.projectType = '';
    this.model.projectType = '';
    this.model.projectName = '';
    this.projectName = '';
    this.projectTitle = '';
    this.songTitle = '';
    this.episodeTitle = '';
    this.model.rateType = '';
    this.model.songTitle = '';
    this.model.episodeTitle = '';
    this.model.seriesTitle = '';
    this.model.artistTitle = '';
    this.model.paymentDate = '';
    this.model.wrapDay = '';
    this.model.prepDay = '';
    this.model.shootDay = '';
    this.model.city = '';
    this.model.rate = null;
    this.model.state = '';
    this.model.crewRoles = [];
    this.model.productionCompany ='';
    this.preDay ='';
    this.shootDay = '';
  

  
  }

  onDataItem(event)
  {
    if(this.model.crewRoles.length>0)
    {
      this.onSelectData(event);
    }
 else{
      this.model.crewRoles = [];
      this.model.prepDay = '';
      this.model.wrapDay = '';
      this.model.rate = null;
  }
  }
  protected onSend() {
    const req = new HireProfileRequest();
    req.crewRoles = this.model.crewRoles;
    req.paymentDate = this.model.paymentDate;
    req.message = this.model.message;
    req.projectType = this.model.projectType;
    req.productionCompany = this.model.productionCompany;
    req.rate = this.model.rate;
    req.rateType = this.model.rateType;
    req.city = this.model.city;
    req.state = this.model.state;
    req.artistTitle = this.model.artistTitle;
    req.seriesTitle = this.model.seriesTitle;
    req.paymentMethod=this.model.paymentMethod;

    if(this.episodeTitle && this.episodeTitle.length!=undefined)
    {
      req.episodeTitle = this.episodeTitle;
    }
    else
    {
      req.episodeTitle = this.model.episodeTitle;
    }
    
    if(this.songTitle && this.songTitle.length!=undefined)
    {
      req.songTitle = this.songTitle;
    }
    else
    {
      req.songTitle = this.model.songTitle;
    }
    if(this.projectName && this.projectName.length!=undefined)
    {
     req.projectName = this.projectName
    }
    else
    {
      req.projectName = this.model.projectName;
    }
  
     req.prepDay = this.model.prepDay;
     req.shootDay = this.model.shootDay;
     req.shootDate=this.model.shootDate;
     
     
     if((this.model.shootDay.indexOf(',')>0 && this.model.shootDay.length>=5) || this.model.shootDay.length>=5 )
     {
      var dateData = this.model.shootDay.split(',');
       req.shootDate = new Array(dateData.length);
       req.shootDay = null;
     
        for(var i = 0;i<dateData.length;i++)
        {
              req.shootDate[i] = dateData[i];
        }
        
     }

     if((this.model.prepDay.indexOf(',')>0 && this.model.prepDay.length>=5) || this.model.prepDay.length>=5 )
     {
       var dateData = this.model.prepDay.split(',');
        req.prepDate = new Array(dateData.length);
        req.prepDay = null;
        for(var i=0;i<dateData.length;i++)
        {
              req.prepDate[i] = dateData[i];
        }
        
     }
   
    if(this.model.wrapDay)
    {
      req.wrapDay = this.model.wrapDay; 
    }
    else
    {
        req.wrapDay = null
    }
   
    debugger;  
    if(this.acceptTerms && this .hireTerms && this.lateFees)
    {
    this.hireSub = this.hireSvc
      .hireProfile(this.profileSysId, req)
      .subscribe
      (
      r => this.onSaveSuccess(),
      e => this.onSaveError(e),
    );
  }
  else
  {
    this.requiredPolicy = true;
  }

 }

  private getCrewRoles() {
    this.crewSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
      this.allCrewRoles = crewRoles;
    }, e => this.onLoadError());
  }

  private getLocalDropdowns() {
    this.allProjectTypes = this.lookupSvc.getProjectTypes();
  }

  private getSongTitles(title, type) {
    this.hireSvc.filterSongByTitles(title, type).subscribe(data => {
      this.songTitleSuggestions = data;
    }, e => this.onLoadError());
  }

  private projectsByTitle(title, type) {
    this.hireSvc.filterProjectByTitles(title, type).subscribe(data => {
      this.suggestions = data;
        }, e => this.onLoadError());
  }

  private getEpisodeTitles(title, type) {
    this.hireSvc.filterEpisodeByTitles(title, type).subscribe(data => {
      this.episodeTitleSuggestions = data;
    }, e => this.onLoadError());
  }
     
 private selectionHireTerms(selection:boolean)
 {
  
    this.hireTerms = selection;
    this.requiredPolicy = false;
 }
  
private selectionCancelTerms(selection:boolean)
{
  this.acceptTerms = selection;
  this.requiredPolicy = false;
}

private selectionLateFeesTerms(selection:boolean)
{
  this.lateFees = selection;
  this.requiredPolicy = false;
}


  private getDetailsByRoles(type,title,role)
  {
    this.hireSvc.filterByRolesAndTitles(type,title,role).subscribe(data=>
      {
        if(data.length >= 1)
        {
        this.filteredSuggestions = data;
        this.model.projectType = this.filteredSuggestions[0].projectType;
        this.model.projectName = this.filteredSuggestions[0].projectName;
        this.model.productionCompany = this.filteredSuggestions[0].productionCompany;
        this.model.rate = this.filteredSuggestions[0].rate;
        this.model.rateType = this.filteredSuggestions[0].rateType;
        this.model.city = this.filteredSuggestions[0].city;
        this.model.state = this.filteredSuggestions[0].state;
        this.model.paymentDate = this.datePipe.transform(this.filteredSuggestions[0].paymentDate, 'MM/d/yyyy');
        this.model.wrapDay = this.datePipe.transform(this.filteredSuggestions[0].wrapDay, 'MM/d/yyyy');  
        this.preDay = "";
        this.shootDay = "";
       for(let i = 0; i<this.filteredSuggestions[0].prepDay.length; i++)
        {
           var date = this.filteredSuggestions[0].prepDay[i];
         
           if(i == this.filteredSuggestions[0].prepDay.length-1)
           {
            this.preDay += (this.datePipe.transform(date,'MM/d/yyyy'));
           }
           else{
            this.preDay += (this.datePipe.transform(date,'MM/d/yyyy'))+',';
           }       
        }
      
        for(let i=0; i<this.filteredSuggestions[0].shootDay.length; i++)
        {
           let shootDate = this.filteredSuggestions[0].shootDay[i];
         
           if(i == this.filteredSuggestions[0].shootDay.length-1)
           {
          
            this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'));
         
           }
           else{
            this.shootDay += (this.datePipe.transform(shootDate,'MM/d/yyyy'))+',';
             
           }       
        }
      
       this.model.shootDay = this.shootDay;   
       this.model.prepDay = this.preDay;
      }
      else{ 
        this.model.wrapDay = '';
        this.model.prepDay = '';
        this.model.rate = null;
      }
      },e=> this.onLoadError())
  }


 
  
  onSelectData(role)
  {
  var title;
  
   if (this.model.projectType == "Web Series" || this.model.projectType == "Television Show") {
    
    if(this.episodeTitle && this.episodeTitle.length!=undefined)
    {
    title = this.episodeTitle;
    }
    else
    {
      
      title = this.model.episodeTitle;
    }

    this.getDetailsByRoles(this.model.projectType,title,this.model.crewRoles)  
  
   }
   else if(this.model.projectType == "Music Video") {
    if(this.songTitle && this.songTitle.length!=undefined )
    {
      title = this.songTitle;
    }
    else
    {
      title = this.model.songTitle;
    }
    this.getDetailsByRoles(this.model.projectType,title,this.model.crewRoles)  
  }
  else
  {

    
    if(this.projectName && this.projectName.length!=undefined)
    {
     title = this.projectName
    }
    else
    {
      title = this.model.projectName
    }

    this.getDetailsByRoles(this.model.projectType,title,this.model.crewRoles)
  }
  }
  showLateFeesDialog()
  {
    this.lateFeePolicyDialogService.showDialog();
  }

  showHirePolicy()
  {
    this.hirePolicyDialogService.showDialog();

  }
  showCancelPolicy()
  {
      this.cancelationPolicyDialogService.showDialog();
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
}
