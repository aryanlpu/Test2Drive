import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LegalTermsRoutingModule } from 'legal/terms/terms-routing.module';
import { SharedModule } from 'shared/shared.module';
import { LegalTermsComponent } from 'legal/terms/terms.component';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        LegalTermsRoutingModule
    ],
    declarations: [
        LegalTermsComponent
    ],
    exports: [ 
        LegalTermsComponent 
    ]
})
export class LegalTermsModule {}