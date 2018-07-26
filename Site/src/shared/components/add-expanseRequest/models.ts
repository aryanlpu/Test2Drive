
import { DialogHeader } from './../../dialogs/header/DialogHeader';



export class HireProfileDialog {
  public id: number;
  public header: DialogHeader;
  public projectType: string;
  public crewRoles: string[]
  public message: string;
  public city: string;
  public state: string;
  public showTitle: boolean;
  public productionCompany: string;
  public songTitle:string;
  public artistTitle: string;
  public episodeTitle: string;
  public seriesTitle: string;
  public rate: number;
  public rateType: string;
  public newModeType:any;
  public projectName: string;
  public prepDay:string;
  public shootDay:string;
  public wrapDay:string;
  public paymentDate: string;
  public prepDate:string[];
  public shootDate:string[];
  public paymentMethod:string;
  constructor() {
    this.state = "";
    this.rateType="";
    this.paymentMethod ="";
  }

}

export class HireProfile
{
  header:DialogHeader;
}



export class HireProfileRequest {
  public projectType: string;
  public crewRoles: string[]
  public message: string;
  public productionCompany: string;
  public city: string;
  public state: string;
  public showTitle: boolean;
  public songTitle: string;
  public artistTitle: string;
  public episodeTitle: string;
  public seriesTitle: string;
  public rate: number;
  public rateType: string;
  public projectName: string;
  public prepDay:string;
  public shootDay:string;
  public wrapDay:string;
  public paymentDate: string;
  public prepDate:string[];
  public shootDate:string[];
  public paymentMethod:string;
}


