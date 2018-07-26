import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SearchCardsResponse } from '../search/models';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class HomeService {
    constructor (
        private http: HttpClient
    ) { }

    getFeaturedMembers(): Observable<SearchCardsResponse> {
        const url = environment.endpoints.search.featured;

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetCards(r));
    }

    private onGetCards(response: ISiteApiResponse) {
        return response.data || {};
    }
}