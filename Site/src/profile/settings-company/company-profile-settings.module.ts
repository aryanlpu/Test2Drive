import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
    CheckboxModule, 
    FileUploadModule, 
    RadioButtonModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ConfirmationService,
    DialogModule
} from 'primeng/primeng';

import { CustomFormsModule } from 'ng2-validation'
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'shared/shared.module';

import { CompanyProfileSettingsRoutingModule } from './company-profile-settings.routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { CompanyProfileSettingsComponent } from './company-profile-settings.component';
import { ProfileService } from '../profile.service';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        CheckboxModule,
        TextMaskModule,
        CustomFormsModule,
        FileUploadModule,
        AutoCompleteModule,
        DialogModule,
        RadioButtonModule,
        ConfirmDialogModule,
        CompanyProfileSettingsRoutingModule
    ],
    declarations: [
        CompanyProfileSettingsComponent,
        ChangePasswordComponent,
    ],
    exports: [ 
        CompanyProfileSettingsComponent
    ],
    providers: [
        ProfileService,
        ConfirmationService
    ]
})
export class CompanyProfileSettingsModule {}