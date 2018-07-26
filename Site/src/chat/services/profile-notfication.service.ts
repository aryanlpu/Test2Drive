import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignalRUserNotification, UserNotification, UserNotificationResult } from 'shared/components/site-menu/models';

@Injectable()
export class ProfileNotificationService {

    constructor(private _http: HttpClient) { };

    //for sharing data between components
    private messageSource = new BehaviorSubject<any>("");
    private readAllNotificationSource = new BehaviorSubject<any>("");
    private getNotificationSource = new BehaviorSubject<any>("");
    public messageNoticationCount: any = [];
    currentMessage = this.messageSource.asObservable();
    readAllNotification = this.readAllNotificationSource.asObservable();
    getNotification = this.getNotificationSource.asObservable();

    private showNotificationSource = new Subject<SignalRUserNotification>();
    public showNotification$ = this.showNotificationSource.asObservable();
    private userNotificationCount = new Subject<any>();

    private _listners = new Subject<any>();
    private _notificationCount = new Subject<any>();

    getUserNotificationCount$(): Observable<any> {
        return this.userNotificationCount.asObservable();
    }

    showNotification(data: UserNotification, connection: any) {
        let model = new SignalRUserNotification();
        model.connection = connection;
        model.data = data;
        this.showNotificationSource.next(model);
    }

    changeMessage(message: any) {
        this.messageSource.next(message)
    }

    notificationCount(): Observable<any> {
        return this._notificationCount.asObservable();
    }

    listen(): Observable<any> {
        return this._listners.asObservable();
    }

    filter(filterBy: string) {
        this._listners.next(filterBy);
    }

    myNotificationCount(filterBy: any, toUserId: any, fromUserId: any) {
        var model = {
            count: filterBy,
            touser: toUserId,
            fromUser: fromUserId
        };
        this._notificationCount.next(model);
    }

    getUserNotifications(page: number): Observable<UserNotificationResult> {
        const url = environment.endpoints.notification.getUserNotifications(page);
        return this._http.get<ISiteApiResponse>(url)
            .map((response) => this.onGetData(response))
            .catch(this.handleError);
    }

    getMessageNotifications(page: number): Observable<UserNotificationResult> {
        const url = environment.endpoints.notification.getMessageNotifications(page);
        return this._http.get<ISiteApiResponse>(url)
            .map((response) => this.onGetData(response))
            .catch(this.handleError);
    }

    readUserNotifications() {
        const url = environment.endpoints.notification.readAllNotification;
        return this._http.get(url)
            .map((response) => response)
            .catch(this.handleError);
    }

    readMessageNotifications() {
        const url = environment.endpoints.notification.readAllMessageNotification;
        return this._http.get(url)
            .map((response) => response)
            .catch(this.handleError);
    }

    getUserNotificationCount() {
        const url = environment.endpoints.notification.getUserNotificationCounts;
        return this._http.get(url)
            .map((response: Response) => response)
            .catch(this.handleError);
    }

    getMessageNotificationCount() {
        const url = environment.endpoints.notification.getMessageNotificationCounts;
        return this._http.get(url)
            .map((response: Response) => response)
            .catch(this.handleError);
    }

    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error || 'Server error');
    }
}
