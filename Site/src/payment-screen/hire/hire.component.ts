import { Component,ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router ,Params} from '@angular/router';
import { AuthService } from 'auth/auth.service';


import { 
    ViewChild, 
    ComponentFactoryResolver,
    ViewContainerRef } from '@angular/core';


@Component({
    selector: 'ij-hire',
    templateUrl: './hire.component.html'
})

export class HireComponent    implements OnInit  {
    @ViewChild('parent', { read: ViewContainerRef }) container: ViewContainerRef;
   
    public hireRequest:boolean=false;
    public project:boolean=false;
    public action:string;
    constructor(
      private activatedRoute:ActivatedRoute

     ) {

 }
    
  ngOnInit() {
   
        this.activatedRoute.params.subscribe((params:Params)=>{
            if((params['action']) == 'hire-request'){
               this.hireRequest=true;
            }
          
             if((params['action']) == 'project'){
                   this.project=true;
                   localStorage.setItem("action","project")
                }
           });
    }
  
 

   
        

}
