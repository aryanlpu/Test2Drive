import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// routing
import { AboutRoutingModule } from './about-routing.module';

// modules
import { SharedModule } from '../shared/shared.module';

// components
import { AboutComponent } from './about.component';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        AboutRoutingModule
    ],
    declarations: [
        AboutComponent
    ],
    exports: [ 
        AboutComponent 
    ],
    providers: [ 
    ]
})
export class AboutModule {}