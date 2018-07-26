import { NgModule, APP_INITIALIZER } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigService } from './app-config.service';

import { HomeModule } from 'home/home.module';
import { AuthService } from 'auth/auth.service';
import { AuthGuard } from 'auth/auth.guard';
import { AuthTokenInterceptor } from 'auth/auth-token.interceptor';
import { ServerOfflineInterceptor } from 'auth/server-offline.interceptor';

import { ProgressColorService } from 'shared/services/progress-color.service';
import { LookupService } from 'shared/services/lookup.service';
import { PushNotificationsModule, PushNotificationsService } from 'ng-push';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { MaintenanceModule } from 'maintenance/maintenance.module';
import { ChatModule } from 'chat/chat.module';
import { ProfileModule } from 'profile/profile.module';
import { LoginModule } from 'login/login.module';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

const ServerOfflineInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ServerOfflineInterceptor,
  multi: true,
};

const AuthTokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true,
};

const AppConfigServiceProvider = {
  provide: APP_INITIALIZER,
  useFactory: appInitializerFn,
  multi: true,
  deps: [AppConfigService]
};

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    AppRoutingModule,

    BrowserAnimationsModule, 
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    NgProgressRouterModule,
    MaintenanceModule,
    ChatModule
  ],
  declarations: [ 
    AppComponent 
  ],
  providers: [
    AppConfigService,
    AppConfigServiceProvider,
    AuthService, 
    LookupService, 
    AuthGuard,
    ServerOfflineInterceptorProvider,
    AuthTokenInterceptorProvider,
    PushNotificationsService,
    NotificationsService,
    ProgressColorService
  ],
  bootstrap: [ 
    AppComponent 
  ]
})
export class AppModule {}
