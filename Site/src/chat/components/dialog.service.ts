import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Data, ChatWindow } from './models';

@Injectable()
export class ChatDialogService {
  private showDialogSource = new Subject<any>();
  public showDialog$ = this.showDialogSource.asObservable();

  private showToChatDialogSource = new Subject<any>();
  public showToChatDialog$= this.showToChatDialogSource.asObservable();

  private showUserTypingSource = new Subject<any>();
  public showUserTyping$ = this.showUserTypingSource.asObservable();

  private showUserNotificationSource = new Subject<any>();
  public showUserNotification$ = this.showUserNotificationSource.asObservable();

  private showUserOfflineSource = new Subject<any>();
  public showUserOffline$ = this.showUserOfflineSource.asObservable();

  private showUserOnlineSource = new Subject<any>();
  public showUserOnline$ = this.showUserOnlineSource.asObservable();

  private hideToChatDialogSource = new Subject<any>();
  public hideToChatDialog$ = this.hideToChatDialogSource.asObservable();

  private hideToNotificationCountSource = new Subject<any>();
  public hideToNotificationCount$ = this.hideToNotificationCountSource.asObservable();

  private onSendMessageSource = new Subject<any>();
  public sendMessage$ = this.onSendMessageSource.asObservable();

  private onUserOnlineSource = new Subject<string>();
  public userOnline$ = this.onUserOnlineSource.asObservable();

  private onUserOfflineSource = new Subject<string>();
  public userOffline$ = this.onUserOfflineSource.asObservable();

  showDialog(profileSysId: string, connection: any) {

    var model = {
      profileSysId: profileSysId,
      connection: connection
    }
    this.showDialogSource.next(model);
  }

  showToChatDialog(data: Data<ChatWindow>) {
    this.showToChatDialogSource.next(data);
  }

  showUserTyping(data: any, connection: any) {
    var model = {
      data: data,
      connection: connection
    }
    this.showUserTypingSource.next(model);
  }

  showUserOffline(data: any, connection: any) {
    var model = {
      data: data,
      connection: connection
    }
    this.showUserOfflineSource.next(model);
  }

  showUserOnline(data: any, connection: any) {
    var model = {
      data: data,
      connection: connection
    }
    this.showUserOnlineSource.next(model);
  }

  showUserNotification(data: any, connection: any) {
    var model = {
      data: data,
      connection: connection
    }
    this.showUserNotificationSource.next(model);
  }

  hideToChatDialog() {
    this.hideToChatDialogSource.next();  
  }

  hideNotificationCount() {
    this.hideToNotificationCountSource.next();
  }

  sendMessage(data: any){
    this.onSendMessageSource.next(data);
  }

  userOnline(data: string){
    this.onUserOnlineSource.next(data);
  }

  userOffline(data: string){
    this.onUserOfflineSource.next(data);
  }
}
