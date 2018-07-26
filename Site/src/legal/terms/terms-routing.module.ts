import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalTermsComponent } from './terms.component';

const routes: Routes = [
    { path: '', component: LegalTermsComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LegalTermsRoutingModule {}