import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CancelProjectRequestDialog,CancelOption } from './models';
import { EditProjectRequest } from './models';
import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";
import * as httputils from 'shared/angular/http';
import { observableToBeFn } from 'rxjs/testing/TestScheduler';
import { CanActivate } from '@angular/router';

@Injectable()
export class ProjectService {
  CancelOptionList : CancelOption[];
  constructor(
    private http: HttpClient
  ) { }

  newProject(req: CancelProjectRequestDialog): Observable<boolean> {
debugger;
  //req.cancellationOption1 ='1';
    const utils = new SiteApiResponseUtilities();
    // const url = environment.endpoints.profile.freelancer.project();
    const url = environment.endpoints.cancellation.nonmutualcancel();

    return this.http
      .post(url, req)
      .map(r => true)
      .catch(r => utils.onServiceError(r));
  }
  

  MutualCancelProject(req: CancelProjectRequestDialog): Observable<boolean> {
    debugger;
      //req.cancellationOption1 ='1';
        const utils = new SiteApiResponseUtilities();
        // const url = environment.endpoints.profile.freelancer.project();
        const url = environment.endpoints.cancellation.mutualcancel();
        return this.http
          .post(url, req)
          .map(r => true)
          .catch(r => utils.onServiceError(r));
      }
      
    


// getCancelOption(){
//   const url = environment.endpoints.cancellation.CancelOption;
//  return this.http
//   .get(url)
//   .map(data => data as CancelProjectRequestDialog[]);
// }


  private onGet(response: ISiteApiResponse) {
    return response.data || {};
  }
}
