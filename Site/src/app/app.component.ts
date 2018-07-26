import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { PushNotificationsService } from 'ng-push';
import { AuthService, AuthResult } from 'auth/auth.service';
import { ProgressColorService } from 'shared/services/progress-color.service';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';

import 'rxjs/add/operator/filter';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    progressColor: string;
    notificationOptions = {};

    private progressSub: Subscription;
    private routerSub: Subscription;

    constructor(
        private router: Router,
        private pushSvc: PushNotificationsService,
        private authSvc: AuthService,
        private progressSvc: ProgressColorService,
        private intercomSvc: IntercomProxyService
    ) {
        this.progressColor = this.progressSvc.color;
        
        this.notificationOptions = {
            position: ["bottom", "right"],
            timeOut: 2500,
            showProgressBar: false,
            theClass: "ij-notification"
        };

        this.pushSvc.requestPermission();

        this.progressSub = this.progressSvc.changed$.subscribe(c => {
            this.progressColor = c;
        });
    }

    ngOnInit() {
        this.authSvc.isOnIJSite = 'true';
        
        window.addEventListener('focus', this.onFocus);
        window.addEventListener('blur', this.onBlur);
        document.addEventListener("visibilitychange", this.visibilityChange);

        this.routerSub = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(event => {
                this.onNavigationEnd();
                window.scrollTo(0, 0);
        });

        this.setupIntercom();

        if (environment.maintenance){
            this.router.navigate(['/maintenance']);
        }
    }

    ngOnDestroy() {
        this.routerSub.unsubscribe();
        this.progressSub.unsubscribe();
    }
    
    onFocus = (event) => {
        this.authSvc.isOnIJSite = 'true';
    }

    onBlur = (event) => {
        this.authSvc.isOnIJSite = 'false';
    }

    visibilityChange = (event) => {
        if (document.hidden) {
            this.authSvc.isOnIJSite = 'false';
        } else {
            this.authSvc.isOnIJSite = 'true';
        }
    }

    onNavigationEnd() {
        window.scrollTo(0, 0);
        this.intercomSvc.update();
    }

    setupIntercom() {
        let name = this.authSvc.isLoggedIn ? this.authSvc.fullName : null;
        let email = this.authSvc.isLoggedIn ? this.authSvc.userName : null;
        this.intercomSvc.boot(name, email);
    }
}