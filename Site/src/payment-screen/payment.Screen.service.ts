import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';
import { Observable } from 'rxjs/Observable';

import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import * as httputils from 'shared/angular/http';
import { environment } from 'environments/environment';
import { HireProfileRequestDisplay, PaymentHire, OriginalPaymentDetail, negoiationHistory } from '../payment-screen/models'
import 'rxjs/add/operator/catch';
import { MutualCancellationDialog } from './dialogs/mutual-cancellation/models';
@Injectable()
export class PaymentScreenService {
    private respUtils = new SiteApiResponseUtilities();

    constructor (
        private http: HttpClient
    ) { }

   
    getHireDetails(id: number) {
        const url = environment.endpoints.profile.freelancer.hireContactDetails(id);
     return this.http
            .get(url)
            .map(data => data as HireProfileRequestDisplay);
  }

  getNegoiationHistory(id: number) {
    const url = environment.endpoints.profile.freelancer.getNegoiationHistory(id);
    return this.http
      .get(url)
      .map(data => data as negoiationHistory[]);
  }

  getHireDetailsOriginal(id: number) {
    const url = environment.endpoints.profile.freelancer.hireContactDetailsOriginal(id);
    return this.http
      .get(url)
      .map(data => data as OriginalPaymentDetail);
  }

    acceptHireDetails(id:number,status:string)
    {
        const url = environment.endpoints.profile.freelancer.acceptHireDetails(id,status);
        return this.http
        .post(url,null)
        .map(r=>true);
    }

    saveNagotiationDetail(model:PaymentHire)
    {
        const url = environment.endpoints.profile.freelancer.saveNegotiate();
        debugger;
        return this.http
        .post(url,model)
        .map(r=>true);
    }
    
    deniedNagotiationRequest(hireId)
    {

        const url = environment.endpoints.profile.freelancer.deniedNegotiation(hireId);
        debugger;
        return this.http
        .get(url)
        .map(r=>true); 


    }


    sendNegotiateNotification(id:number)
    {
        const url=environment.endpoints.profile.freelancer.notification(id);
        debugger;
        return this.http.post(url,[]).map(r=>true);
    }

    getPDF(pageSrc)
    {
        
       return this.http.get(
            pageSrc,
            {responseType: 'arraybuffer' as 'json'}
          )

    }

    
    getCancelOptions(type: number) {
        const url = environment.endpoints.project.cancelOptions(type);
        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetCards(r));
    }


    getProfileCard(hireId: number) {
        const url = environment.endpoints.project.card(hireId);
        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetCards(r));
    }


    mutualCancel(model: MutualCancellationDialog) {
        const url = environment.endpoints.project.mutualCancel;
        return this.http
            .post<ISiteApiResponse>(url, model)
            .map(r => this.onGetCards(r));
    }


    
    private onGetCards(response: ISiteApiResponse) {
        return response.data || {};
    }
   
    
}
