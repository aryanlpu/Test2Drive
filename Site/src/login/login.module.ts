import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { CustomFormsModule } from 'ng2-validation'

import { ForgotPasswordDialogComponent } from './forgot-password/dialog.component';
import { ForgotPasswordDialogService } from './forgot-password/dialog.service';

import { DialogModule } from 'primeng/primeng';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    CustomFormsModule,
    LoginRoutingModule,
    DialogModule,
    SharedModule 
  ],
  declarations: [ 
    LoginComponent,
    ForgotPasswordDialogComponent
  ],
  exports: [ 
    LoginComponent 
  ],
  providers: [
    ForgotPasswordDialogService
  ]
})
export class LoginModule { }