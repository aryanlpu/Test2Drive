import { Component, Input, OnChanges } from '@angular/core';
import {additionaKit} from './model';
import {LookupService} from './../../services/lookup.service'
import { NotificationsService } from 'angular2-notifications';
declare var $:any;
@Component({
    selector: 'ij-additiona-kitShow',
    templateUrl: 'additiona-kitShow.component.html',
    styleUrls: ['./styles.less']
})
export class AdditionaKitShowComponent {
    public model:additionaKit[];
    public id:number;
    public description:string;
    public rate:number;
    public inablefocus:boolean=false;
    public descriptionReadOnly:boolean=true;
    public rateReadOnly:boolean=true;
    public showId:number;
    @Input()
    set data(id:number)
    {
      this.id=id;
    } 
 constructor(
   private lookupservice:LookupService,
   private notificationSvc:NotificationsService
 )
{
    setTimeout(()=>{
        this.lookupservice.getKitDetails(this.id).subscribe(data=>
            {
             this.model=data;
            });
    },200);

  
}
removeKit(kitId,hireId)
{
  this.lookupservice.deleteKit(kitId,hireId).subscribe(data=>{});
  location.reload();
}
showCheckIcon(value:string,id:number)
{
    this.showId = id;
    if(value == 'rate')
    {
        this.rateReadOnly=true;
      
    }
    else{
        
        this.descriptionReadOnly=true;
    }
    this.inablefocus=true; 

}

}
   

