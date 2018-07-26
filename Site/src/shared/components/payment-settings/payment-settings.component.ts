import { Component, ViewEncapsulation, OnDestroy,OnInit, ViewChild } from '@angular/core';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/subscription';
import { AuthService } from 'auth/auth.service';
import { patterns } from 'shared/view/regex-patterns';
import { multicast } from 'rxjs/operator/multicast';
import { AccountService } from './account.service';
import { NotificationsService } from 'angular2-notifications';
import { constants } from 'environments/constants';
import { masks } from 'shared/view/masks';
import { environment } from 'environments/environment';
import { LookupService } from 'shared/services/lookup.service';
import { CorporateStructure } from 'shared/services/CorporateStructure';
import { DatePipe } from '@angular/common'
import { ConfirmationService } from 'primeng/primeng';
import { ProfilePage } from '../../../profile/models';
import { ProfileService } from '../../../profile/profile.service';

import {
    BankDetail,
    CreditCard,
    BankAccount,
    PdfUploadResponse,
    PersonalInformation
    
    } from './models';
import { debounce } from 'rxjs/operators';
import { MULTISELECT_VALUE_ACCESSOR } from 'primeng/primeng';

@Component({
    selector: 'ij-payment-settings',
    templateUrl: './payment-settings.component.html',
    styleUrls: ['./styles.less'],
    providers:[DatePipe]
})
export class PaymentSettingsComponent implements OnDestroy  {
    proModel: ProfilePage;
    private respUtils = new SiteApiResponseUtilities();
    public showSaveErrored: boolean;
    public submitted: boolean;
    private bankSub: ISubscription;
    public activePaymentOption;
    public model: BankDetail;
    public w9FileSize = constants.w9.maxSize;
    public accountNumRegex = patterns.accountNumRegex;
    public routingInValid: boolean;
    public accountNoInvalid: boolean; 
    public EinInvalid: boolean;
    public accountNameInvalid: boolean;
    public confirmAccountInvalid: boolean;
    public businessStructureInvalid: boolean;
    public errors: string[] = [];
    public allCorporateTypeSuggestions: string[];
    public corporateStructure: CorporateStructure[];
    public message: string;
    public success: string;
    public allBankAccouts: BankAccount[];
    public allCreditCards: CreditCard[];
    public hasPayment: boolean = true;
    public personalInformation: PersonalInformation;
    public personalmodel: PersonalInformation;
    public requiredPersonl: boolean;
    public confirmAcceptLabel: string = "Yes";
    public hasPay: boolean=false;
    public expireDate0: string;
    public expireDate1: string;
    public invalidName: boolean;
    public invalidCreditCardNumber: boolean;
    public invalidDate: boolean;
    public invalidState: boolean;
    public invalidSecurityCode: boolean;
    public invalidAccountName: boolean;
    public invalidZip: boolean;
    public init: Number = 1;
    public intt: Number = 0;
    

  constructor(
        private authSvc: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private notificationSvc: NotificationsService,
        private lookupSvc: LookupService,
        private datepipe: DatePipe,
        private confirmSvc: ConfirmationService,
        private profileService: ProfileService
   
  ) {
    this.hasPayment = true;
    
    this.model = new BankDetail();
    this.personalInformation = new PersonalInformation();
    this.corporateStructure = this.lookupSvc.getCorporateStructure();
    this.getBankAccounts();
    this.getCreditCards();
    this.profileService.getSettings().subscribe( r => { 
      this.model.w9 = r.w9;
    });

    if (!this.hasPay) {
     
      this.hasPayment = false;

    }
  

     }

    ngOnDestroy() {
        if (this.bankSub) {
            this.bankSub.unsubscribe();
      }
     
  }
  

    @ViewChild('w9') w9;
    public w9Url = environment.endpoints.upload.w9;

    selectOption(option:string)
    {
    
        this.activePaymentOption = option;
        window.scrollTo(0,250);
  }
  onCorporateTypeKeyDown(event) {
    const query = (event.query || "").toLocaleLowerCase();

    this.allCorporateTypeSuggestions = this.corporateStructure
      .filter(f => f.name.toLocaleLowerCase().indexOf(query) != -1 && f.name.toLocaleLowerCase()!="others")
      .map(r => r.name);
  }
    saveCredit(form)
    {
        this.submitted = true;
        this.showSaveErrored = false;
      var error = "";
      if (!this.hasPayment) {
        if (this.model.socialSecurityOrEIN == undefined) {
          this.EinInvalid = true;
          error = "error";
        }
        else {
          this.EinInvalid = false;
        }
      }

      if (!form.valid) return;

      if (error != "") {
        return false;
      }

     


      if (!this.hasPayment) {
        if (this.w9.files.length > 0) {
          this.w9.upload();
        }
      }
        this.bankSub = this.accountService
            .saveCreditCard(this.model)
            .first()
          .subscribe(r => {
            this.message = r;
            
            if (r == null) {
              this.onSaveSuccess();              
              this.hasPayment = true;
              this.requiredPersonl = false;
              this.activePaymentOption = false;

              this.getBankAccounts();
              this.getCreditCards();
              this.model.accountName = '';
              this.model.accountNumber = '';
              this.model.routing = '';
              this.model.conAccountNumber = '';
              this.model.creditCardNumber = '';
              this.model.expirationDate = '';
              this.model.nameOnCard = '';
              this.model.billingState = '';
              this.model.billingZip = '';
              this.model.securityCode = '';
              this.model.socialSecurityOrEIN = '';
            }
                
            },
        e => this.onSaveError(e));

    }

    saveBankAccount(form)
    {
        this.submitted = true;
        this.showSaveErrored = false;

      if (!form.valid) {
        if (!(form.value.routing)) {
          this.routingInValid = true;
        }
        if (!(form.value.accountNumber)) {
          this.accountNoInvalid = true;
        }
        if (!(form.value.conAccountNumber)) {
          this.confirmAccountInvalid = true;
        }
        if (!(form.value.accountName)) {
          this.accountNameInvalid = true;
        }      
        if (this.model.socialSecurityOrEIN == undefined) {
          this.EinInvalid = true;
        }       
        if (this.model.businessStructure == undefined) {
          this.businessStructureInvalid = true;
        }
        return;
      }
      var error = "";
      if (this.model.routing.toString().length != 9) {
        this.routingInValid = true;
        error = "notValid";
      }
      else {
        this.routingInValid = false;
       
      }
      if (this.model.accountNumber.toString().length != 8) {
        this.accountNoInvalid = true;
        error = "notValid";
      }
      else {
        this.accountNoInvalid = false;
       
      }
      if (!this.hasPayment) {
        if (this.model.socialSecurityOrEIN.toString().length != 9) {
          this.EinInvalid = true;
          error = "notValid";         
        }

        else {
          this.EinInvalid = false;
        }
      }
      if (this.model.accountNumber != this.model.conAccountNumber) {
        this.confirmAccountInvalid = true;
        error = "notValid";
      }
      else {
        this.confirmAccountInvalid = false;
      }
      if (error != "") {
        return
      };
      if (!this.hasPayment) {
        if (this.w9.files.length > 0) {
          this.w9.upload();
        }
      }
        this.bankSub = this.accountService
            .saveBankAccount(this.model)
            .first()
          .subscribe(r => {
            this.message = r;
            
            if (r == null) {
              this.onSaveSuccess();             
              this.hasPayment = true;
              this.requiredPersonl = false;
              this.getBankAccounts();
              this.getCreditCards();
              this.activePaymentOption = false;

              this.model.accountName = '';
              this.model.accountNumber = '';
              this.model.routing = '';
              this.model.conAccountNumber = '';
              this.model.creditCardNumber = '';
              this.model.expirationDate = '';
              this.model.nameOnCard = '';
              this.model.billingState = '';
              this.model.billingZip = '';
              this.model.securityCode = '';
              this.model.socialSecurityOrEIN = '';
            }
                
            },
        e => this.onSaveError(e));
    }

    private onSaveSuccess() {
        this.showSaveErrored = false;
        this.errors = [];
        this.profileService.getSettings().subscribe(r=>{
        this.model.w9 = r.w9;
        });
        if (this.notificationSvc) {
          this.notificationSvc.success("Success", "Your settings have been updated.");
      
        }
    }

    private onSaveError(error = null) {
        if (typeof (error) === "string") {
            this.errors.push(error);
        } else {
            if (error) {
                this.errors = this.respUtils.getErrors(error);
            }
        }

        this.showSaveErrored = true;
    }
    onBeforeSend(event) {
        debugger
        if (event.xhr) {
            event.xhr.setRequestHeader('Authorization', this.authSvc.bearer);
        }
    }
    onPdfUploaded(event) {
        debugger
        const xhr = event.xhr as XMLHttpRequest;

        if (xhr != null && xhr.status == 200) {
            const resp = JSON.parse(xhr.response) as ISiteApiResponse;
            const data = resp.data as PdfUploadResponse;
            this.model.w9 = data.fileName;
         
            if (!resp.error && !data.error) {
                this.onSaveSuccess();
            }
            else {
                this.onSaveError();
            }
        }
        else {
            this.onSaveError();
        }
    }
    showFormInvalid(form) {
        return this.submitted && form.invalid && !this.showSaveErrored;
  }
  getBankAccounts() {
    this.accountService.getBankAccounts().subscribe(r => {
      this.allBankAccouts = r;
      if (this.allBankAccouts.length > 0) {
        this.hasPayment = true;
        this.hasPay = true;
        debugger;
        this.personalInformation.businessStructure = this.allBankAccouts[0].businessStructure;
        this.personalInformation.socialSecurityOrEIN = this.allBankAccouts[0].socialSecurityOrEIN;
        this.personalInformation.w9 = this.allBankAccouts[0].w9;
        this.personalmodel = this.personalInformation
        console.log(this.allBankAccouts);
        this.init = 1;

      }
      else {
        this.init = 0;
      }
      
    })
  }
  getCreditCards() {
    debugger;
    this.accountService.getCreditCard().subscribe(r => {      
      this.allCreditCards = r;
      if (this.allCreditCards.length > 0) {
        this.hasPayment = true;
        this.hasPay = true;
        this.personalInformation = this.allCreditCards[0];
        this.personalInformation.businessStructure = this.allCreditCards[0].businessStructure.toString();
        this.personalInformation.socialSecurityOrEIN = this.allCreditCards[0].socialSecurityOrEIN;
        this.personalInformation.w9 = this.allCreditCards[0].w9;
        this.personalmodel = this.personalInformation;
        for (let i = 0; i < this.allCreditCards.length; i++) {

          this.allCreditCards[i].expirationDate = this.datepipe.transform(this.allCreditCards[i].expirationDate, 'MM/d/yyyy')
          if (i == 0) {
            this.expireDate0 = this.allCreditCards[i].expirationDate
          }
          else if (i == 1) {
            this.expireDate1 = this.allCreditCards[i].expirationDate

          }


        }
        this.intt = 1;
      }
      else {
        if (this.init == 1) {
          this.intt = 1;
        }
        else {
          this.init = 0;
          this.intt = 1;
        }
      }
     
    })

  }

  deleteCreditCrd(creditCardId: Number) {
    debugger;
    let message = "Are you sure you want to delete this CreditCard?";
    this.confirmAcceptLabel = "Yes";
    let rejectVisible = true;

    this.confirmSvc.confirm({
      message,
      header: "Delete CreditCard",
      rejectVisible,
      accept: () => {
        this.accountService.deleteCreditCard(creditCardId).subscribe(detail => {
          this.allCreditCards = detail;
          if (this.allCreditCards.length > 0) {
            this.hasPayment = true;
            this.personalInformation = this.allCreditCards[0];
            this.personalInformation.businessStructure = this.allCreditCards[0].businessStructure.toString();
            this.personalInformation.socialSecurityOrEIN = this.allCreditCards[0].socialSecurityOrEIN;
            this.personalInformation.w9 = this.allCreditCards[0].w9;
            this.personalmodel = this.personalInformation;
            for (let i = 0; i < this.allCreditCards.length; i++) {
              this.allCreditCards[i].expirationDate = this.datepipe.transform(this.allCreditCards[i].expirationDate, 'MM/d/yyyy')
            }
          }
        })

      }
    });

  }

  deleteBankAccount(bankAccountId: Number) {
    let message = "Are you sure you want to delete this BankAccount?";
    this.confirmAcceptLabel = "Yes";
    let rejectVisible = true;

    this.confirmSvc.confirm({
      message,
      header: "Delete BankAccount",
      rejectVisible,
      accept: () => {
        debugger;
        this.accountService.deleteBankAccount(bankAccountId).subscribe(detail => {
          this.allBankAccouts = detail;
          if (this.allBankAccouts.length > 0) {
            this.hasPayment = true
            debugger;
            this.personalInformation.businessStructure = this.allBankAccouts[0].businessStructure;
            this.personalInformation.socialSecurityOrEIN = this.allBankAccouts[0].socialSecurityOrEIN;
            this.personalInformation.w9 = this.allBankAccouts[0].w9;
            this.personalmodel = this.personalInformation
          }
        })

      }
    });

  }
  
  makeDefaultCredit(id:Number) {
    this.accountService.makeDefaultCredit(id).subscribe(r => {
      this.allCreditCards = r;
      if (this.allCreditCards.length > 0) {
        this.hasPayment = true;
        this.personalInformation = this.allCreditCards[0];
        this.personalInformation.businessStructure = this.allCreditCards[0].businessStructure.toString();
        this.personalInformation.socialSecurityOrEIN = this.allCreditCards[0].socialSecurityOrEIN;
        this.personalInformation.w9 = this.allCreditCards[0].w9;
        this.personalmodel = this.personalInformation;
        for (let i = 0; i < this.allCreditCards.length; i++) {
          this.allCreditCards[i].expirationDate = this.datepipe.transform(this.allCreditCards[i].expirationDate, 'MM/d/yyyy')
        }
        this.getBankAccounts();
      }
    })
  }
  makeDefaultAccount(id:Number) {
    this.accountService.defaultBankAccount(id).subscribe(r => {
      this.allBankAccouts = r;
      if (this.allBankAccouts.length > 0) {
        this.hasPayment = true
        debugger;
        this.personalInformation.businessStructure = this.allBankAccouts[0].businessStructure;
        this.personalInformation.socialSecurityOrEIN = this.allBankAccouts[0].socialSecurityOrEIN;
        this.personalInformation.w9 = this.allBankAccouts[0].w9;
        this.personalmodel = this.personalInformation;
        this.getCreditCards();
        console.log(this.allBankAccouts);
      }
    })
  }
  cancelPayment() {
    this.activePaymentOption = false;
  }

  
  
}
