import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalPrivacyComponent } from './privacy.component';

const routes: Routes = [
    { path: '', component: LegalPrivacyComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LegalPrivacyRoutingModule {}