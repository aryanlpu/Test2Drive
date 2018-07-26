import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChatService {
  constructor(private _http: HttpClient) {
   }

  get(url: string): Observable<any> {
    return this._http.get(url)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
    
  }

  post(url: string, model: any): Observable<any> {
    let body = JSON.stringify(model);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, body)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  put(url: string, id: number, model: any): Observable<any> {
    let body = JSON.stringify(model);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.put(url + id, body)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  delete(url: string, id: number): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(url + id)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  getChat(url: string, model: any): Observable<any> {
    let body = JSON.stringify(model);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, body)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);

  
  }

  uploadFiles(url: string, file: any): Observable<any> {
    return this._http.post(url, file)
      .map((response: Response) => <any>response)
      .catch(this.handleError);
  }

  updateNotifications(msgId: string) {
    const url = environment.endpoints.chat.updateNotifications(msgId);
    return this._http.get(url)
      .map((response: Response) => <any>response)
      .catch(this.handleError);
  }

  showChatWindow(msgId: string) {
    const url = environment.endpoints.chat.showChatWindow(msgId);
    return this._http.get(url)
      .map((response: Response) => <any>response)
      .catch(this.handleError);

    
  }

  readMoreNotifications(userId: string, pageSize: any) {
    const url = environment.endpoints.chat.readMoreNotifications(userId, pageSize);
    return this._http.get(url)
      .map((response: Response) => <any>response)
      .catch(this.handleError);
  }

  notificationCounts(userId: string) {
    const url = environment.endpoints.chat.getNotificationCounts(userId);
    return this._http.get(url)
      .map((response: Response) => <any>response)
      .catch(this.handleError);
  }

  hideNotificationCount(userId: string) {
    const url = environment.endpoints.chat.hideNotificationsCount(userId);
    return this._http.get(url)
      .map((response: Response) => <any>response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error || 'Server error');
  }
}