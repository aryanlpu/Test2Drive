import { Injectable, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ISignalRConnection, SignalR, IConnectionOptions, SignalRConnection } from '@dharapvj/ngx-signalr';
import { AuthService } from 'auth/auth.service';
import { environment } from 'environments/environment';
import { ChatConfig } from '../config';

@Injectable()
export class SignalRConnectionService {
    private subject: Subject<ISignalRConnection>;
    public connection: Observable<ISignalRConnection>;

    constructor(private signalR: SignalR, private authSvc: AuthService) {
        this.subject = new Subject<ISignalRConnection>();
        this.connection = this.subject.asObservable().take(1);

        // if (navigator.onLine && !ChatConfig.BASE_CONNECTION) {
        //     this.connect();
        // }
    }

    public connect() {
        if(ChatConfig.ConnectionExists){
            return;
        }
        // Set ProfileSysId
        let qs = { 'profileSysId': this.authSvc.profileSysId };
        let options: IConnectionOptions = {
            hubName: 'ChatHub',
            qs: qs,
            url: environment.site.api
        };
        let promise = this.signalR.connect(options);
        promise
            .then((x: SignalRConnection) => {
                ChatConfig.BASE_CONNECTION = x;
                ChatConfig.My_ConnectionId = x.id;
                ChatConfig.ConnectionExists = true;
                this.subject.next(x);
                x.errors.subscribe(y => {
                    if (y.message.includes(`Couldn't reconnect within the configured timeout`)) {
                        this.reconnect();
                    }
                })
            })
            .catch(x => this.reconnect());
    }

    private reconnect() {
        let ms = 5000;
        console.log(`Manual reconnect after ${ms}ms`);
        setTimeout(() => this.connect(), ms)
    }
}