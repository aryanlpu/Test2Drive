import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LegalPrivacyRoutingModule } from 'legal/privacy/privacy-routing.module';
import { SharedModule } from 'shared/shared.module';
import { LegalPrivacyComponent } from 'legal/privacy/privacy.component';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        LegalPrivacyRoutingModule
    ],
    declarations: [
        LegalPrivacyComponent
    ],
    exports: [ 
        LegalPrivacyComponent 
    ]
})
export class LegalPrivacyModule {}