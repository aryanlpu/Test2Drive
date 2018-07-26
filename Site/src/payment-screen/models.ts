import { DialogHeader } from '../shared/dialogs/header/DialogHeader'
import { environment } from 'environments/environment';
export class HireHistory {
    count: number;
    items: HireHistoryItem[];
    showOffers: boolean ;
    showAcceptedJobs: boolean; 
    showPreviousJobs: boolean; 
    showCancelledJobs: boolean;
        
}

export class HireHistoryRequest {
    page: number;
    jobType: JobTypes;
}
export class negoiationHistory {
  public Id: number;
  public History: string;
  public CreationDate: string;
  public HireId: number;
  public profileId:Number;
}


interface HireHistoryItem {
    profileSysId: string,
    hiredProfileImageUrl: string,
    hireByProfileImageUrl: string,
    fullName: string,
    hiredProfileName: string,
    hiredByProfileName: string,
    projectName: string,
    crewRoles: string,
    createdDate: string,
    createdOn: Date,
    id: number,
    projectType: ProjectTypes,
    status: HireStatusTypes
}

export class HireProfileDialog {
    public header: DialogHeader;
    public projectType: string;
    public rate: number;
    public rateType: string;
    public crewRoles: string[];
    public dates: string[];
    public message: string;
    public city: string;
    public state: string;
}



export class UserProfileModel
{
public fullName: string;
public hireableCrewRoles: string;
public location: string;
public defaultBudget: string;
public industryScore: number;
public profileImageName: string;
public profileImageUrl: string;
public email: string;
public hideDetail: boolean;


}

export class OriginalPaymentDetail {
  public rate: number;
  public rateType: string;
  public shootDay: string[] = [];
  public prepDay: string[] = [];
  public wrapDay: string;
  public crewRoles: string;
  public projectType: string;
}

export class HireProfileRequestDisplay {
    public header: DialogHeader;
    public id :number;
    public projectType: string;
    public rate: number;
    public rateType: string;
    public crewRoles: string;
    public crewRoleDetails:string[];
    public dates: string;
    public message: string;
    public city: string;
    public state: string;
    public profileHireSysID:string;
    public profileToHireSysID: string;
    public hiredByProfileID: String;
    public hiredProfileId: String;
    public contactcard:string;
    public status:HireStatusTypes
    public hiredProfileImageUrl:string;
    public hireByProfileImageUrl:string;
    public hiredProfileName:string;
    public hiredByProfileName:string;
    public crewRoleList:string[];
    public hiredCrewRoleList:string[];
    public defaultBudget :string;
    public locations:string;
    public hiredDefaultBudget:string;
    public hiredLocations:string;
    public budgets :string[];
    public hiredBudgets:string[];
    public wrapDay:string;
    public paymentDate:string;
    public prepDay:string[]=[];
    public shootDay:string[]=[];
    public shootDate:string;
    public prepDate:string;
    public isRateAccepted: boolean;
    public TotalPayment: number;
  public TotalPaymentAfterTax: number;
  public Deduction: number;
    constructor ()
    {
       
    }
}

export enum JobTypes {
    All = 1,
    Offers = 2,
    Accepted = 3,
    Previous = 4,
    Cancelled = 5
}

export enum ProjectTypes {
    Commercial = 1,
    MusicVideo = 2,
    FeatureFilm = 3,
    TelevisionShow = 4,
    NewMedia = 5,
    WebSeries = 6,
    ShortFilm = 7
}

export enum HireStatusTypes {
    Offer = 1,
    Accepted = 2,
    Denied = 3,
    Completed = 4,
    Cancelled = 5
}

export class PaymentHire
{
   public id:number;
   public rate:string;
   public rateType:string;
   public prepDay:string[];
   public shootDay:string[];
   public  wrapDay:string;
   public crewRoleList:string[];
  public hiredProfileId: number;
  public Nego: string;
  public NegotiationBy: string;
 
}

export enum CancelOptionTypes{
    Cancel = 1,
    Mutual = 2
}