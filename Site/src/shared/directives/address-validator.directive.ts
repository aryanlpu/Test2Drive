import { Directive, Input, OnDestroy, forwardRef } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AddressService, IValidCityRequest } from '../services/address.service';
import { constants } from 'environments/constants';

@Directive({
    selector: '[ij-address]',
    providers: 
    [
        { 
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => AddressValidatorDirective),
            multi: true
        },
        AddressService
    ],
    exportAs: 'ijAddress'
})
export class AddressValidatorDirective implements Validator {
    debugger;
    @Input('ij-city') cityCtrl: AbstractControl;
    @Input('ij-state') stateCtrl: AbstractControl;
    @Input('ij-zipcode') zipcodeCtrl: AbstractControl;
    @Input('ij-city-state') onlyCityState: AbstractControl

    public invalid: boolean = false;

    get ready() {
       
        if (!this.cityCtrl && !this.stateCtrl && !this.zipcodeCtrl) {
            return false;
        }
        if(this.onlyCityState)
        {
            return this.cityCtrl.value
            && this.stateCtrl.value
            && this.cityCtrl.valid 
            && this.stateCtrl.valid;
        }
        return this.cityCtrl.value
            && this.stateCtrl.value
            && this.zipcodeCtrl.value
            && this.cityCtrl.valid 
            && this.stateCtrl.valid 
            && this.zipcodeCtrl.valid;
    }

    constructor (
        private addressSvc: AddressService
    ) { }
    
    validate(control: AbstractControl): Observable<{[key : number] : any}> {
        if (!this.ready) {
            return Observable.of(null);
        } 
        const self = this;
          if(this.onlyCityState){
            const req: IValidCityRequest = {
                city: self.cityCtrl.value,
                state: self.stateCtrl.value,
            };
           return this.isValid(req);
          }
          else{
            const req: IValidCityRequest = {
                city: self.cityCtrl.value,
                state: self.stateCtrl.value,
                zipcode: self.zipcodeCtrl.value
            };
             return this.isValid(req);
          }

      
          
        }
    
        isValid(req)
        {
            return this.addressSvc.isValidCity(req)
            .map(r => {
                this.invalid = !r;
                return r ? null : { address: 'The address is invalid.' };
            }); 
        }
       
    
   
}