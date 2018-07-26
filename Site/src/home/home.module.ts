import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MobileAppComponent } from './mobile-app.component';
import { HomeService } from './home.service';
import { SignalRConnectionService } from 'chat/services/signalR.connection.service';
import { ChatModule } from 'chat/chat.module';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    // ChatModule
  ],
  declarations: [
    HomeComponent,
    MobileAppComponent
  ],
  exports: [ 
    HomeComponent 
  ],
  providers: [
    HomeService,
    SignalRConnectionService
  ]
})
export class HomeModule {}