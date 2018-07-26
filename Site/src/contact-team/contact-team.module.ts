
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'shared/shared.module';
import { ContactTeamRoutingModule } from './contact-team.routing.module';
import { ContactTeamComponent } from './contact-team.component';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        ContactTeamRoutingModule
    ],
    declarations: [
        ContactTeamComponent
    ],
    exports: [ 
        ContactTeamComponent 
    ],
})
export class ContactTeamModule {}