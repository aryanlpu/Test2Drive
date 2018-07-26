import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SignalR, ISignalRConnection, IConnectionOptions } from '@dharapvj/ngx-signalr';
import { environment } from 'environments/environment';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class ChatConnectionResolver implements Resolve<ISignalRConnection> {
    private static isConnected: boolean = false;

    constructor(
        private signalR: SignalR,
        private authSvc: AuthService
    ) { }

    resolve() {
        if (!environment.production) {
            console.log('Resolving chat connection.');
        }

        if (!ChatConnectionResolver.isConnected) {
            ChatConnectionResolver.isConnected = true;

            // Set ProfileSysId
            let qs = { 'profileSysId': this.authSvc.profileSysId };
            let options: IConnectionOptions = {
                hubName: 'ChatHub',
                qs: qs,
                url: environment.site.api
            };

            return this.signalR.connect(options);
        }

        return new Promise<ISignalRConnection>((resolve => {
            resolve();
        }));
    }
}