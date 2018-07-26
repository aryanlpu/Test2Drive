import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HireProfileRequest } from './models';

import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";
import { HireProfileRequestDisplay, PaymentHire, OriginalPaymentDetail, negoiationHistory } from '../../../payment-screen/models'

@Injectable()
export class HireAddExpenseService {
  constructor(
    private http: HttpClient
  ) { }

  getHireDetails(id: number) {
    const url = environment.endpoints.profile.freelancer.hireContactDetails(id);
 return this.http
        .get(url)
        .map(data => data as HireProfileRequestDisplay);
}

}
