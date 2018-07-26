import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HireProfileRequest } from './models';

import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";

@Injectable()
export class HireRequestService {
  constructor(
    private http: HttpClient
  ) { }

  hireProfile(profileSysId: string, req: HireProfileRequest): Observable<boolean> {
    const url = environment.endpoints.profile.freelancer.hire(profileSysId);
       
    return this.http
      .post(url, req)
      .map(r => true);
  }

  filterSongByTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.filterSongByTitles(title, type);
    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  filterEpisodeByTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.filterEpisodeByTitles(title, type);

    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  filterProjectByTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.filterProjectByTitles(title, type);
    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  private onGet(response: ISiteApiResponse) {
    return response.data || {};
  }


  filterByRolesAndTitles(type:string,title:string,role:string[])
  {
    const url = environment.endpoints.profile.freelancer.filterByRole(type,title,role);
    return this.http
    .post<ISiteApiResponse>(url, {})
    .map(r => this.onGet(r));
  }
 

}
