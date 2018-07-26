import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NewProjectRequest } from './models';
import { EditProjectRequest } from './models';
import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";

@Injectable()
export class ProjectService {
  constructor(
    private http: HttpClient
  ) { }

  newProject(req: NewProjectRequest): Observable<boolean> {
    const utils = new SiteApiResponseUtilities();
    const url = environment.endpoints.profile.freelancer.project();

    return this.http
      .post(url, req)
      .map(r => true)
      .catch(r => utils.onServiceError(r));
  }


  private onGet(response: ISiteApiResponse) {
    return response.data || {};
  }
}
