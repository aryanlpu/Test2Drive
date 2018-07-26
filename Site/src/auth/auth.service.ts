import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { Observable } from 'rxjs/Observable';
import { SocialUser, ConfirmAccount } from 'login/models';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import { SignalRConService } from 'chat/services/signalR.service';
import { ChatConfig } from 'chat/config';

export enum AuthResult {
    Success = 0,
    InvalidCredentials = 1,
    EmailNotConfirmed = 2,
    ServerOffline = 3,
}

interface ILoginResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    userName: string,
    fullName: string,
    profileSysId: string,
    refresh_token: string,
    thumbnailImageName: string,
    ".issued": string,
    ".expires": string,
    userPositionInList: string/*newly added to get the user position in the list*/
}

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient
    ) { }

    cachedRequests: Array<HttpRequest<any>> = [];
    authTokenStale: string = 'stale_auth_token';
    authTokenNew: string = 'new_auth_token';
    currentToken: string;

    private socialUserInfo: SocialUser;

    get profileSysId() {
        return localStorage.getItem(environment.storage.auth.profileSysId);
    }


    get userName() {
        return localStorage.getItem(environment.storage.auth.userName);
    }

    get fullName() {
        return localStorage.getItem(environment.storage.auth.fullName);
    }
    /*newly added to get the user postion in the list start */
    get userPositionInList() {
        return localStorage.getItem(environment.storage.auth.userPositionInList);
    }
    /*newly added to get the user postion in the list end */
    get userProfileUrlDisplayName() {
        return (this.fullName.split(' ').join('') + this.userPositionInList).replace(/^\s+|\s+$/gm,'');
    }
    get thumbnailImageName() {
        return localStorage.getItem(environment.storage.auth.thumbnailImageName);
    }

    set thumbnailImageName(v: string) {
        localStorage.setItem(environment.storage.auth.thumbnailImageName, v);
    }

    get currentProfileSysId() {
        return localStorage.getItem(environment.storage.auth.currentProfileSysId);
    }

    get isLoggedIn() {
        return this.accessToken !== null;
    }

    get bearer() {
        if (!this.isLoggedIn) {
            return null;
        }

        return `Bearer ${this.accessToken}`;
    }

    get signalRConnectionId() {
        return localStorage.getItem(environment.storage.signalR.connectionId);
    }

    private get accessToken() {
        return localStorage.getItem(environment.storage.auth.accessToken);
    }

    private get refreshToken() {
        return localStorage.getItem(environment.storage.auth.refreshtoken);
    }

    collectFailedRequest(request): void {
        this.cachedRequests.push(request);
    }

    retryFailedRequests(): void {
        // retry the requests. this method can
        // be called after the token is refreshed
    }

    login(username: string, password: string): Observable<AuthResult> {
        const params = new HttpParams()
            .set("username", username)
            .set("password", password)
            .set("grant_type", "password");

        const headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded");

        return this.http
            .post<ILoginResponse>(environment.endpoints.auth.url, params, { headers })
            .map(r => this.onLogin(r))
            .catch(e => this.onError(e));
    }

    getAccessToken() {
        const params = new HttpParams()
            .set("refresh_token", this.refreshToken)
            .set("grant_type", "refresh_token");

        const headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded");

        return this.http
            .post<ILoginResponse>(environment.endpoints.auth.url, params, { headers })
            .map(r => this.onRefreshTokenSuccess(r))
            .catch((error: any) => {
                return Observable.throw(error.statusText);
            });
    }

    logout(): void {
        localStorage.removeItem(environment.storage.auth.accessToken);
        localStorage.removeItem(environment.storage.auth.profileSysId);
        localStorage.removeItem(environment.storage.auth.thumbnailImageName);
        localStorage.removeItem(environment.storage.auth.loginWithIJ);
        localStorage.removeItem(environment.storage.auth.refreshtoken);
        localStorage.removeItem(environment.storage.auth.userName);
        localStorage.removeItem(environment.storage.auth.fullName);
        localStorage.removeItem(environment.storage.auth.userPositionInList);
        let signalRSvc = new SignalRConService(ChatConfig.BASE_CONNECTION);
        signalRSvc.stopConnection();
        setTimeout(() => {
            window.location.reload();
        });
    }

    externalUserInfo(access_token): Observable<SocialUser> {
        const headers = new HttpHeaders()
            .set("Authorization", 'Bearer ' + access_token);
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.auth.userInfo, { headers })
            .map(r => this.onGetSocialUserInfo(r))
    }

    forgotPassword(email: string) {
        return this.http
            .get(environment.endpoints.auth.forgotPassword(email))
            .map(r => r)
            .catch(e => e)
    }

    resetPassword(model: any) {
        return this.http
            .post(environment.endpoints.auth.resetPassword, model)
            .map(r => r)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    confirmEmail(model: ConfirmAccount) {
        return this.http
            .post(environment.endpoints.auth.confirmEmail, model)
            .map(r => r)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    resendMail(email: string) {
        return this.http
            .get(environment.endpoints.auth.resendMail(email))
            .map(r => r)
            .catch(e => e)
    }

    private onLogin(response: ILoginResponse): AuthResult {
        if (response.access_token) {
            localStorage.setItem(environment.storage.auth.accessToken, response.access_token);
            localStorage.setItem(environment.storage.auth.profileSysId, response.profileSysId);
            localStorage.setItem(environment.storage.auth.refreshtoken, response.refresh_token);
            localStorage.setItem(environment.storage.auth.thumbnailImageName, response.thumbnailImageName);
            localStorage.setItem(environment.storage.auth.userName, response.userName);
            localStorage.setItem(environment.storage.auth.fullName, response.fullName);
            //newly added to get the user position in the list start
            localStorage.setItem(environment.storage.auth.userPositionInList, response.userPositionInList);
            //newly added to get the user position in the list end
            if (this.isLoggedInWithIJ == 'initiate') {
                localStorage.setItem(environment.storage.auth.loginWithIJ, 'complete');
            }

            return AuthResult.Success;
        } else {
            return AuthResult.InvalidCredentials;
        }
    }

    private onRefreshTokenSuccess(response: ILoginResponse): AuthResult {
        if (response.access_token) {
            localStorage.setItem(environment.storage.auth.accessToken, response.access_token);
            localStorage.setItem(environment.storage.auth.profileSysId, response.profileSysId);
            localStorage.setItem(environment.storage.auth.refreshtoken, response.refresh_token);
            localStorage.setItem(environment.storage.auth.thumbnailImageName, response.thumbnailImageName);
            localStorage.setItem(environment.storage.auth.userName, response.userName);
            localStorage.setItem(environment.storage.auth.fullName, response.fullName);
            return AuthResult.Success;
        } else {
            return AuthResult.ServerOffline;
        }
    }

    private onError(error): Observable<AuthResult> {
        if (error.status == 400) {
            let error_msg: string = error.error.error_description;
            if (AuthResult[error_msg] == AuthResult.InvalidCredentials) {
                return Observable.of(AuthResult.InvalidCredentials);
            }
            if (AuthResult[error_msg] == AuthResult.EmailNotConfirmed) {
                return Observable.of(AuthResult.EmailNotConfirmed);
            }
        }

        return Observable.of(AuthResult.ServerOffline)
    }

    private onGetSocialUserInfo(response: ISiteApiResponse) {
        return response.data as SocialUser || new SocialUser();
    }

    get socialUser() {
        return this.socialUserInfo;
    }

    saveSocialUserInfo(model: SocialUser) {
        this.socialUserInfo = model;
    }

    get isLoggedInWithIJ() {
        return localStorage.getItem(environment.storage.auth.loginWithIJ);
    }

    set isOnIJSite(v: string) {
        localStorage.setItem(environment.storage.auth.isOnIJSite, v);
    }

    get isOnIJSite() {
        return localStorage.getItem(environment.storage.auth.isOnIJSite);

    }
}
