import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ContactTeamRequest } from './models';

@Injectable()
export class ContactTeamService {
    constructor (
        private http: HttpClient
    ) { }

    sendMessage(req: ContactTeamRequest){
        const url = environment.endpoints.contactteam.contact;

        return this.http
            .post(url, req)
            .map(r => true);        
    }
}