import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';
import { Observable } from 'rxjs/Observable';
import {
    BankDetail,
    CreditCard,
    BankAccount

} from './models';

import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import * as httputils from 'shared/angular/http';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/catch';
import { retry } from 'rxjs/operators';


@Injectable()
export class AccountService {
    private respUtils = new SiteApiResponseUtilities();

    constructor (
        private http: HttpClient
    ) { }

  makeDefaultCredit(cardId: Number) {
    const url = environment.endpoints.profile.freelancer.defaultCreditCard(cardId);
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }
  defaultBankAccount(accountId: Number) {
    const url = environment.endpoints.profile.freelancer.defaultBankAccount(accountId);
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }
    getPersonalInformation()
    {
      
    }

    saveCreditCard(creditCard: CreditCard) {
        debugger
        const url = environment.endpoints.profile.freelancer.addCreditcardDetail;

        return this.http
            .post(url, creditCard)
            .map(r => r as JSON)
            .catch(e => this.respUtils.onServiceError(e));
    }
    saveBankAccount(bankAccount: BankAccount) {
        debugger
        const url = environment.endpoints.profile.freelancer.addAccountDetail;
        return this.http
            .post(url, bankAccount)
          .map(r => r as JSON)
            .catch(e => this.respUtils.onServiceError(e));
    }
  getCreditCard() {
    const url = environment.endpoints.profile.freelancer.getAllCreditCards();
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }
  getBankAccounts() {
    const url = environment.endpoints.profile.freelancer.getAllBankAccounts();
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }

  deleteBankAccount(bankAccountId:Number) {
    const url = environment.endpoints.profile.freelancer.deleteAccount(bankAccountId);
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }

  deleteCreditCard(creditCardId: Number) {
    const url = environment.endpoints.profile.freelancer.deleteCreditCard(creditCardId);
    return this.http.get(url)
      .map(r => this.onGetSuccessful(<ISiteApiResponse>r))
      .catch(e => this.respUtils.onServiceError(e))
  }


  private onGetSuccessful(response: ISiteApiResponse) {
        return response.data || null;
    }
    
}
