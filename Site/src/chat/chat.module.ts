import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SignalRModule } from '@dharapvj/ngx-signalr';
import { MomentModule } from 'angular2-moment';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { NgIdleModule } from '@ng-idle/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ChatConnectionResolver } from './connection.resolver';
import { ProfileNotificationService } from 'chat/services/profile-notfication.service';
import { ChatService } from 'chat/components/chat.service';
import { createConfig } from 'chat/config';

import { ChatDialogComponent } from 'chat/components/dialog.component';
import { ChatDialogService } from 'chat/components/dialog.service';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MomentModule,
        InfiniteScrollModule,
        Ng2DeviceDetectorModule.forRoot(),
        NgIdleModule.forRoot(),
        SignalRModule.forRoot(createConfig),
        RouterModule
    ],
    
    providers: [
        ChatConnectionResolver, 
        ProfileNotificationService, 
        ChatService,
        ChatDialogService
    ],

    declarations: [
        ChatDialogComponent
    ],
    
    exports: [
        ChatDialogComponent,
        RouterModule
    ]
})
export class ChatModule { }