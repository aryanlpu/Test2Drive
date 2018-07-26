import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor (
      private http: HttpClient
    ) { }

    loadAppConfig() {
        return this.http.get('/assets/configs/current.json?k=' + (new Date).getTime())
            .toPromise()
            .then(data => {
                this.appConfig = data;
                Object.assign(environment, this.appConfig);
        });
    }
  
    getConfig() {
        return this.appConfig;
    }
}