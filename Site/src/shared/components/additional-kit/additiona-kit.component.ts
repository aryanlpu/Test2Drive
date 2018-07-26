import { Component, Input } from '@angular/core';
import {additionaKit} from './model';
import {LookupService} from './../../services/lookup.service'
import { NgForm } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'ij-additiona-kit',
    templateUrl: 'additiona-kit.component.html',
    styleUrls: ['./styles.less']
})
export class AdditionaKitComponent {
    public model:additionaKit;
 _ref: any
 public description:string;
 public disabled:boolean=false;
 public rate:number;
 private form: NgForm;
 public data:any;
 public inablefocus:boolean=false;
 constructor(
   private lookupservice:LookupService,
   private notificationSvc:NotificationsService
 )
 {

 }
    removeKit() {
    this._ref.destroy();
}
saveKit(form: NgForm){
        this.form = form;
        if (!form.valid) return;        
       
        this.data=form.value;
        this.disabled=true;
        var hireId=JSON.parse(localStorage.getItem("HireId"))
         this.data.hireId=hireId;
         this.lookupservice.hireAdditionalKit(this.data).subscribe(r=>{ 
             if (this.notificationSvc) {
             this.notificationSvc.success("Success", "Kit fees has been added.");
         };
     });
 
    }
    showCheckIcon()
    {
      this.inablefocus=true; 
    }


    
   

}