import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { ChatConfig } from 'chat/config';
import { environment } from 'environments/environment';
import { ChatDialogService } from 'chat/components/dialog.service';
import { ProfileNotificationService } from 'chat/services/profile-notfication.service'

import { SignalRConnection, SignalR, IConnectionOptions } from '@dharapvj/ngx-signalr';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { SignalRConnectionService } from 'chat/services/signalR.connection.service';
import { AuthService } from 'auth/auth.service';
import { Data, ChatWindow } from 'chat/components/models';

// @Injectable()
export class SignalRConService {
  private timedOut = false;
  private idleEndCount = 0;
  private idleStartCount = 0;
  private idleTimeoutCount = 0;
  private idleTimeoutWarningCount = 0;
  private isIdle: boolean = true;
  private idleState: string = 'Not Started.';

  constructor(
    private connection: SignalRConnection,
    private chatDialog?: ChatDialogService,
    private notificationSvc?: ProfileNotificationService,
    private idle?: Idle
  ) {

    // this.signarlConnectionSvc.connection.subscribe((con: SignalRConnection) => {
    //   this.connection = con;
    // })
    // if (navigator.onLine) {
    //   this.connect();
    // }
    // this.startConnection();
    // if (this.connection)
    //   this.registerServerEvents();
    // this.connection.start();
    // console.log("home " + this.connection.id);
  };

  public startConnection() {
    this.isIdle = false;

    this.idle.setIdle(50);
    this.idle.setTimeout(60);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleEndCount++;
      this.idleState = 'No longer idle.'
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleTimeoutCount++;
      this.connection.start();
      this.idleState = 'Timed out!';
      this.timedOut = true;
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleStartCount++;
      this.idleState = 'You\'ve gone idle!'
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleTimeoutWarningCount++;
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
    });

    this.reset();

    if (!ChatConfig.ConnectionExists) {
      ChatConfig.My_ConnectionId = this.connection.id;
      ChatConfig.BASE_CONNECTION = this.connection;
      this.connection.start();
      var userid = localStorage.getItem(environment.storage.auth.profileSysId);
      if (userid != null || userid != undefined) {
        this.connection.invoke('UpdateNyConnectionId', localStorage.getItem(environment.storage.auth.profileSysId), ChatConfig.My_ConnectionId).then((data: any) => {
        });
      }
    }
    else {
      this.connection = ChatConfig.BASE_CONNECTION;
      ChatConfig.My_ConnectionId = this.connection.id;
      ChatConfig.BASE_CONNECTION = this.connection;
    }
  }

  // private connect() {
  //   // Set ProfileSysId
  //   let qs = { 'profileSysId': this.authSvc.profileSysId };
  //   let options: IConnectionOptions = {
  //     hubName: 'ChatHub',
  //     qs: qs,
  //     url: environment.site.api
  //   };
  //   let promise = this.signalR.connect(options);
  //   promise
  //     .then((x: SignalRConnection) => {
  //       this.connection = x;
  //       this.isExist = true;
  //       x.errors.subscribe(y => {
  //         if (y.message.includes(`Couldn't reconnect within the configured timeout`)) {
  //           this.reconnect();
  //         }
  //       })
  //     })
  //     .catch(x => this.reconnect());
  // }

  // private reconnect() {
  //   let ms = 5000;
  //   console.log(`Manual reconnect after ${ms}ms`);
  //   setTimeout(() => this.connect(), ms)
  // }

  public registerServerEvents() {
    let addChatMessage$ = this.connection.listenFor('userChat');
    let whoisType$ = this.connection.listenFor('sayWhoIsTyping');
    let onConnected$ = this.connection.listenFor('onConnected');
    let userDisconnected$ = this.connection.listenFor('onUserDisconnected');
    let userConnected$ = this.connection.listenFor('onUserConnected');
    let onNotification$ = this.connection.listenFor('onNotification');
    let sendMessage$ = this.connection.listenFor('onSendMessage');

    let userOnline$ = this.connection.listenFor('onUserOnline');
    let userOffline$ = this.connection.listenFor('onUserOffline');

    addChatMessage$.subscribe((result: any) => {
      if (result.toUserId == localStorage.getItem(environment.storage.auth.profileSysId)) {
        this.chatDialog.showToChatDialog(new Data<ChatWindow>(result));
      }
    });

    whoisType$.subscribe((data: any) => {
      this.chatDialog.showUserTyping(data, ChatConfig.BASE_CONNECTION);
    });

    onConnected$.subscribe((data: any) => {
      this.notificationSvc.changeMessage(data.GetAllNotifications);
      var myId = localStorage.getItem(environment.storage.auth.profileSysId);
      this.notificationSvc.myNotificationCount(data.GetAllNotifications, myId, 0);
    });

    userDisconnected$.subscribe((data: any) => {
      this.chatDialog.showUserOffline(data, ChatConfig.BASE_CONNECTION);
    });

    userConnected$.subscribe((data: any) => {
      this.chatDialog.showUserOnline(data, ChatConfig.BASE_CONNECTION);
    });

    onNotification$.subscribe((data: any) => {
      this.notificationSvc.showNotification(data, ChatConfig.BASE_CONNECTION);
    })

    sendMessage$.subscribe((data: any) => {
      this.chatDialog.sendMessage(data);
    })

    userOnline$.subscribe((data: string) => {
      this.chatDialog.userOnline(data);
    })

    userOffline$.subscribe((data: string) => {
      this.chatDialog.userOffline(data);
    })
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  ngOnDestroy() {
    this.idle.stop();
  }

  public stopConnection(): void {
    if (this.connection)
      this.connection.stop();

    ChatConfig.BASE_CONNECTION = null;
    ChatConfig.My_ConnectionId = null;
    ChatConfig.ConnectionExists = false;
    console.log('Stop connection');
  }

  public saveNotification(model) {
    this.connection.invoke('SaveNotification', model).then((data: any) => {
    });
  }

  public userOnline(userId) {
    this.connection.invoke('UserOnline', userId);
  }

  public userOffline(userId) {
    this.connection.invoke('UserOffline', userId);
  }

}
