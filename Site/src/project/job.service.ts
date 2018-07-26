import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as httputils from 'shared/angular/http';

import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { HireHistoryRequest, HireHistory } from './models';
import { NewProjectRequest } from './dialogs/cancel-project/models';
import { MutualCancellationDialog } from './dialogs/mutual-cancellation/models';

@Injectable()
export class JobService {
    constructor(
        private http: HttpClient
    ) { }

    getProjects(request: HireHistoryRequest): Observable<HireHistory> {
        const url = environment.endpoints.project.getHireHistory;
        const params = httputils.toHttpParams(request);

        return this.http
            .get<ISiteApiResponse>(url, { params })
            .map(r => this.onGetCards(r));
    }

    getProjectTabs(): Observable<HireHistory> {
        const url = environment.endpoints.project.projectTabsVisibility;
        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetCards(r));
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